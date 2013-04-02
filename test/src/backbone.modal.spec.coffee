describe 'Backbone.Modal', ->
  view = {}

  beforeEach ->
    view = new Backbone.Modal
      template: -> ''
      views:
        view: -> ''

  afterEach ->
    view = {}

  it "should have Backbone defined", ->
    expect(Backbone).toBeDefined()

  it 'should throw an exception if there is no template or views present', ->
    delete view.views
    delete view.template
    expect(view.render).toThrow()

  it 'should throw an exception if a template is defined and no viewContainer is present', ->

  it 'should throw an exception if no cancelEl is defined', ->

  it 'should throw an exception if no submitEl is defined', ->

  describe 'views:', ->
    it 'should throw an exception if no view is defined within views', ->

    it 'checks for a showOn selector to open it', ->

    it 'should be possible to pass an array with multiple events in it', ->

    it "checks if it's a Backbone.View or just a HTML template that is passed along", ->

    describe '#open', ->
      it 'opens a specific view', ->

  describe '#render', ->
    it 'renders the modal and internal views', ->

  describe '#beforeCancel', ->
    it "calls this method when it's defined", ->

    it 'stops the cancel when it returns false', ->

  describe '#cancel', ->
    it 'calls cancel when cancelEl is triggered or ESC is pressed'

  describe '#beforeSubmit', ->

  describe '#submit', ->

  describe 'when the modal switches between a view', ->
    it 'animates between views', ->