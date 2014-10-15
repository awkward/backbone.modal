describe 'Backbone.Marionette.Modals', ->

  myLayout  = {}
  modal = {}

  beforeEach ->
    class layout extends Backbone.Marionette.LayoutView
      template: -> '<div id="modals"></div>'
      regions:
        modals:
          selector:     '#modals'
          regionClass:  Backbone.Marionette.Modals

    class modal extends Backbone.Modal
      viewContainer: 'div'
      cancelEl: '.destroy'
      submitEl: '.submit'
      template: -> '<a id="id"></a><div></div><a class="destroy"></a><a class="submit"></a>'
      views:
        'click #id':
          view: -> '<p>html</p>'
      cancel: ->
      submit: ->

    myLayout = new layout()
    $('body').append(myLayout.render().el)

  afterEach ->
    myLayout.destroy()
    myLayout  = {}
    modal = {}

  describe '#show', ->
    it 'should stack a modal view', ->
      myLayout.modals.show(new modal())
      expect(myLayout.modals.zIndex).toBe(1)

    it 'should disable modals with zIndex < modal', ->
      view = new modal()
      myLayout.modals.show(view)
      myLayout.modals.show(new modal())

      spyOn(view, 'delegateModalEvents')
      myLayout.modals.destroy()

      expect(view.delegateModalEvents).toHaveBeenCalled()

  describe '#destroy', ->
    it 'should only destroy the last modal', ->
      myLayout.modals.show(new modal())
      myLayout.modals.destroy()
      expect(myLayout.modals.zIndex).toBe(0)

  describe '#destroyAll', ->
    it 'should destroy all the modals', ->
      myLayout.modals.show(new modal())
      myLayout.modals.destroyAll()
      expect(myLayout.modals.zIndex).toBe(0)
