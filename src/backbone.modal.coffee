unless Backbone?
  throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js") 

class Backbone.Modal extends Backbone.View
  constructor: ->
    args = Array::slice.apply(arguments)
    Backbone.View::constructor.apply(this, args)

    @setUIElements()
    @delegateModalEvents()

  setUIElements: ->
    # get modal options
    template        = @getOption('template')
    @views          = @getOption('views')
    @viewContainer  = @getOption('viewContainer')

    throw new Error('No template or views defined for Backbone.Modal') if _.isUndefined(@template) and _.isUndefined(@views)
    throw new Error('No viewContainer defined for Backbone.Modal') if @template and @views and _.isUndefined(@viewContainer)

  getOption: (option) ->
    # get class instance property
    return unless option
    if @options and option in @options and @options[option]?
      return @options[option]
    else
      return @[option]

  delegateModalEvents: ->
    # get elements
    cancelEl = @getOption('cancelEl')
    submitEl = @getOption('submitEl')

    # set event handlers for submit and cancel
    @$el.on 'click', submitEl, @triggerSubmit
    @$el.on 'click', cancelEl, @triggerSubmit

    # set event handlers for views
    for key of @views
      match     = key.match(/^(\S+)\s*(.*)$/)
      trigger   = match[1]
      selector  = match[2]  
      
      @$el.on trigger, selector, @views[key], @triggerView

  buildView: (viewType) ->
    # returns a Backbone.View instance, a function or an object
    if _.isFunction(viewType)
      if new viewType instanceof Backbone.View
        return new viewType(@options)
      else
        return viewType(@options)

    return viewType

  triggerView: (e) =>
    e.preventDefault?()
    options = e.data
    # console.log @buildView(options.view)

  triggerSubmit: (e) ->
    e.preventDefault()

  triggerCancel: (e) ->
    e.preventDefault()

  openAt: (index) ->
    # loop through views and trigger the index
    i = 0
    for key of @views
      view = @views[key] if i is index
      i++

    @triggerView(data: view) if view
    
