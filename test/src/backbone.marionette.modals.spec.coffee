describe 'Backbone.Marionette.Modals', ->

  myLayout  = {}

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

  describe '#show', ->
    it 'should stack a modal view', ->
      myLayout.modals.show(new modal())
      expect(myLayout.modals.zIndex).toBe(1)

    it 'should disable modals with zIndex < modal', ->


  describe '#destroy', ->
    it 'should only destroy the last modal', ->
      myLayout.modals.destroy()
      expect(myLayout.modals.zIndex).toBe(0)

    it 'should enable the last modal', ->


  describe '#destroyAll', ->
    it 'should destroy all the modals', ->
      myLayout.modals.show(new modal())
      myLayout.modals.destroyAll()
      expect(myLayout.modals.modals.length).toBe(0)
