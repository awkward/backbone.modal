describe 'Backbone.Marionette.Modals', ->

  myLayout = {}
  modal = {}
  modalsRegion = {}

  beforeEach ->
    class layout extends Backbone.Marionette.View
      template: -> '<div id="modals"></div>'
      regions:
        modals:
          el: '#modals'
          regionClass: Backbone.Marionette.Modals

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
    modalsRegion = myLayout.getRegion('modals')
    $('body').append(myLayout.render().el)

  afterEach ->
    myLayout.destroy()
    myLayout  = {}
    modal = {}
    modalsRegion = {}

  describe '#show', ->
    it 'should stack a modal view', ->
      modalsRegion.show(new modal())
      expect(modalsRegion.zIndex).toBe(1)

    it 'should disable modals with zIndex < modal', ->
      view = new modal()
      modalsRegion.show(view)
      modalsRegion.show(new modal())

      spyOn(view, 'delegateModalEvents')
      modalsRegion.destroy()

      expect(view.delegateModalEvents).toHaveBeenCalled()

  describe '#destroy', ->
    it 'should only destroy the last modal', ->
      modalsRegion.show(new modal())
      modalsRegion.destroy()
      expect(modalsRegion.zIndex).toBe(0)

  describe '#destroyAll', ->
    it 'should destroy all the modals', ->
      modalsRegion.show(new modal())
      modalsRegion.destroyAll()
      expect(modalsRegion.zIndex).toBe(0)
