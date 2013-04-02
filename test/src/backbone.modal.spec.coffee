describe 'Backbone.Modal', ->
  view  = {}
  modal = {}

  beforeEach ->
    class modal extends Backbone.Modal
      viewContainer: ''
      cancelEl: ''
      submitEl: ''
      template: -> ''
      views:
        'click .class':
          view: -> ''
        'click #id':
          view: -> ''

    view = new modal()

  afterEach ->
    modal = {}
    view  = {}

  it "should have Backbone defined", ->
    expect(Backbone).toBeDefined()

  it 'should throw an exception if there is no template or views present', ->
    delete modal::views
    delete modal::template

    expect(-> view.render()).toThrow()

  it 'should throw an exception if a template and views are defined and no viewContainer is present', ->
    delete modal::viewContainer

    expect(-> view.render()).toThrow()

  describe 'views:', ->
    it 'binds the event to the selector to open a view', ->

    it "checks if it's a Backbone.View or just a HTML template that is passed along", ->

  describe '#openAt', ->
    it 'opens a view at the specified index', ->

  describe '#render', ->
    it 'renders the modal and internal views', ->

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