describe 'Backbone.Modal', ->
  modal = {}

  beforeEach ->
    class backboneView extends Backbone.View

    class modal extends Backbone.Modal
      viewContainer: 'div'
      cancelEl: '.destroy'
      submitEl: '.submit'
      template: -> '<a class="class"></a><a id="id"></a><div></div><a data-event="true"></a><a class="destroy"></a><a class="submit"></a>'
      views:
        'click .class':
          view: new backboneView
        'click #id':
          view: -> '<p>html</p>'
        'click [data-event]':
          view: -> new Backbone.View(option: true)

      _shouldCancel: true
      _shouldSubmit: true
      beforeCancel: -> @_shouldCancel
      beforeSubmit: -> @_shouldSubmit
      cancel: ->
      submit: ->

  afterEach ->
    modal = {}

  it "should have Backbone defined", ->
    expect(Backbone).toBeDefined()

  it 'should throw an exception if there is no template or views present', ->
    delete modal::views
    delete modal::template

    expect(-> new modal()).toThrow()

  it 'should throw an exception if a template and views are defined and no viewContainer is present', ->
    delete modal::viewContainer

    expect(-> new modal).toThrow()

  describe 'views:', ->
    view = {}

    beforeEach ->
      view = new modal()

    it 'should trigger the first view when rendered', ->
      spyOn(view, 'triggerView')
      view.render()

      expect(view.triggerView).toHaveBeenCalled()

    it "#length should return the length of the total views", ->
      expect(view.views.length).toEqual(3)

  describe '#openAt', ->
    it 'opens a view at the specified index', ->
      view = new modal()
      view.openAt(1)
      expect(view.currentIndex).toBe(1)

  describe '#next', ->
    it 'should open the next view', ->
      view = new modal()
      view.render().next()
      expect(view.currentIndex).toBe(1)

  describe '#previous', ->
    it 'should open the previous view', ->
      view = new modal()
      view.render().openAt(2).previous()
      expect(view.currentIndex).toBe(1)

  describe '#currentIndex', ->
    it 'should return the index of the current view', ->
      view = new modal()
      view.render().openAt(2)
      expect(view.currentIndex).toBe(2)

  describe '#render', ->
    it 'renders the modal and internal views', ->
      view = new modal()
      expect((view.render().el instanceof HTMLElement)).toBeTruthy()

  describe '#beforeCancel', ->
    it "should call this method when it's defined", ->
      view = new modal()
      spyOn(view, 'beforeCancel')
      view.render().triggerCancel()
      expect(view.beforeCancel).toHaveBeenCalled()

    it 'stops the cancel when it returns false', ->
      view = new modal()
      spyOn(view, 'destroy')
      view._shouldCancel = false
      view.render().triggerCancel()
      expect(view.destroy).not.toHaveBeenCalled()

  describe '#cancel', ->
    it 'should be called when cancelEl is triggered', ->
      view = new modal()
      spyOn(view, 'cancel')
      view.render().$(view.cancelEl).click()
      expect(view.cancel).toHaveBeenCalled()

  describe '#beforeSubmit', ->
    it "should call this method when it's defined", ->
      view = new modal()
      spyOn(view, 'beforeSubmit')
      view.render().triggerSubmit({preventDefault: ->})
      expect(view.beforeSubmit).toHaveBeenCalled()

    it 'stops the submit when it returns false', ->
      view = new modal()
      spyOn(view, 'submit')
      view._shouldSubmit = false
      view.render().triggerSubmit({preventDefault: ->})
      expect(view.submit).not.toHaveBeenCalled()

  describe '#submit', ->
    it 'should be called when submitEl is triggered', ->
      view = new modal()
      spyOn(view, 'submit')
      view.render().$(view.submitEl).click()
      expect(view.submit).toHaveBeenCalled()

  describe '#clickOutside', ->
    it 'should not throw when outsideElement is undefined', ->
      view = new modal()
      expect(view.clickOutside).not.toThrow();
