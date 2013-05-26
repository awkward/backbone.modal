unless Backbone?
  throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js")

class Backbone.Modal extends Backbone.View
  prefix: 'bb-modal'
  constructor: ->
    args = Array::slice.apply(arguments)
    Backbone.View::constructor.apply(this, args)

    @setUIElements()
    @delegateModalEvents()

  render: ->
    # use openAt or overwrite this with your own functionality
    data = @serializeData()

    @$el.addClass("#{@prefix}-wrapper")
    modalEl = $('<div />').addClass(@prefix)
    modalEl.html @template(data) if @template
    @$el.html modalEl

    if @viewContainer
      @viewContainerEl = modalEl.find(@viewContainer)
      @viewContainerEl.addClass("#{@prefix}-views") 

    @$el.show()
    @openAt(0)
    return this

  setUIElements: ->
    # get modal options
    @template       = @getOption('template')
    @views          = @getOption('views')
    @views?.length  = _.size(@views)
    @viewContainer  = @getOption('viewContainer')

    # hide modal
    @$el.hide()

    throw new Error('No template or views defined for Backbone.Modal') if _.isUndefined(@template) and _.isUndefined(@views)
    throw new Error('No viewContainer defined for Backbone.Modal') if @template and @views and _.isUndefined(@viewContainer)

  getOption: (option) ->
    # get class instance property
    return unless option
    if @options and option in @options and @options[option]?
      return @options[option]
    else
      return @[option]

  serializeData: ->
    # return the appropriate data for this view
    data = {}

    if @model
      data = @model.toJSON()
    else if @collection
      data = {items: @collection.toJSON()}

    return data

  delegateModalEvents: ->
    # get elements
    cancelEl = @getOption('cancelEl')
    submitEl = @getOption('submitEl')

    # set event handlers for submit and cancel
    if submitEl
      @$el.on 'click', submitEl, (e) => @triggerSubmit(e)

    if cancelEl
      @$el.on 'click', cancelEl, (e) => @triggerCancel(e)

    # check for key events
    $('body').on 'keyup', (e) => @checkKey(e)

    # set event handlers for views
    for key of @views
      unless key is 'length'
        match     = key.match(/^(\S+)\s*(.*)$/)
        trigger   = match[1]
        selector  = match[2]

        @$el.on trigger, selector, @views[key], (e) => @triggerView(e)

  checkKey: (e) ->
    switch e.keyCode
      when 27 then @triggerCancel()
      when 13 then @triggerSubmit()

  buildView: (viewType) ->
    # returns a Backbone.View instance, a function or an object
    return unless viewType
    if _.isFunction(viewType)
      data = @serializeData()

      if new viewType instanceof Backbone.View
        view = new viewType(data)
        return {el: view.$el, view: view}
      else
        return {el: viewType(data)}

    return {view: viewType, el: viewType.$el}

  triggerView: (e) ->
    # trigger what view should be rendered
    e?.preventDefault?()
    options       = e.data
    instance      = @buildView(options.view)
    @currentView  = instance.view

    if @viewContainerEl
      @$(@viewContainerEl).html instance.el
    else
      @$el.html instance.el

  triggerSubmit: (e) ->
    # triggers submit
    e?.preventDefault()

    if @beforeSubmit
      return if @beforeSubmit() is false

    @submit?()
    @close()

  triggerCancel: (e) ->
    # triggers cancel
    e?.preventDefault()

    if @beforeCancel
      return if @beforeCancel() is false

    @cancel?()
    @close()

  close: ->
    # closes view
    $('body').off 'keyup', (e) => @checkKey(e)
    @currentView?.remove?()
    @remove()

  openAt: (index) ->
    # loop through views and trigger the index
    i = 0
    for key of @views
      unless key is 'length'
        view = @views[key] if i is index
        i++

    if view
      @currentIndex = index
      @triggerView(data: view)

    return this

  next: ->
    @openAt(@currentIndex+1) if @currentIndex+1 < @views.length-1

  previous: ->
    @openAt(@currentIndex-1) if @currentIndex-1 < @views.length-1


  animate: ->
    # do the animation stuff here
