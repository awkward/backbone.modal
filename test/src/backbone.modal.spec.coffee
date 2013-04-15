describe 'Backbone.Modal', ->
  modal = {}

  beforeEach ->
    class backboneView extends Backbone.View

    class modal extends Backbone.Modal
      viewContainer: 'div'
      cancelEl: ''
      submitEl: ''
      template: -> '<a class="class"></a><a id="id"></a><div></div><a data-event="true"></a>'
      views:
        'click .class':
          view: new backboneView
        'click #id':
          view: -> '<p>html</p>'
        'click [data-event]':
          view: -> new Backbone.View(option: true)

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
      view.render()

      for key of view.views
        match     = key.match(/^(\S+)\s*(.*)$/)
        trigger   = match[1]
        selector  = match[2]
        view.$(selector).trigger(trigger)

    # it 'binds the event to the selector to open a view', ->
    #   spyOn(modal, 'triggerView') # private method, doesn't work

    #   expect(modal.calls.length).toEqual(2)

    it "#buildView: checks if it's a Backbone.View or just a HTML template that is passed along", ->
      for key of view.views
        v = view.buildView(view.views[key].view)
        if _.isFunction(v)
          expect(_.isString(v.render().el))
        else
          expect(_.isString(v))

    it "#length should return the length of the total views", ->


  describe '#openAt', ->
    it 'opens a view at the specified index', ->
      view = new modal()
      expect(view.openAt(1)).toBe(view.views['click #id'])

  describe '#next', ->

  describe '#previous', ->

  describe '#currentIndex', ->

  describe '#render', ->
    it 'renders the modal and internal views', ->
      view = new modal()
      expect(_.isString(view.render().el))

  describe '#beforeCancel', ->
    it "calls this method when it's defined", ->

    it 'stops the cancel when it returns false', ->

  describe '#cancel', ->
    it 'calls cancel when cancelEl is triggered or ESC is pressed'

  describe '#beforeSubmit', ->

  describe '#submit', ->
    it 'calls submit when submitEl is triggered or ENTER is pressed'

  describe 'when the modal switches between a view', ->
    it 'animates between views', ->
