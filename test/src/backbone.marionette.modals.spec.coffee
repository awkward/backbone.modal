describe 'Backbone.Marionette.Modals', ->

  myLayout  = {}

  class layout extends Backbone.Marionette.Layout
    template: -> '<div id="modals"></div>'
    regions:
      modals:
        selector:     '#modals'
        regionType:    Backbone.Marionette.Modals

  class modal extends Backbone.Modal
    viewContainer: 'div'
    cancelEl: '.close'
    submitEl: '.submit'
    template: -> '<a id="id"></a><div></div><a class="close"></a><a class="submit"></a>'
    views:
      'click #id':
        view: -> '<p>html</p>'
    cancel: ->
    submit: ->
  
  myLayout = new layout()

  describe '#show', ->
    it 'should stack a modal view', ->
      myLayout.modals.show(new modal())
      expect(myLayout.modals.zIndex).toBe(1)

    it 'should disable modals with zIndex < modal', ->


  describe '#close', ->
    it 'should only close the last modal', ->
      myLayout.modals.close()
      expect(myLayout.modals.zIndex).toBe(0)

    it 'should enable the last modal', ->
      

  describe '#closeAll', ->
    it 'should close all the modals', ->
      myLayout.modals.show(new modal())
      myLayout.modals.closeAll()
      expect(myLayout.modals.modals.length).toBe(0)


