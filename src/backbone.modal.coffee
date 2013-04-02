unless Backbone?
  throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js") 

class Backbone.Modal extends Backbone.View
  constructor: ->
    args = Array.prototype.slice.apply(arguments)
    Backbone.View.prototype.constructor.apply(this, args)

  render: ->
    @setUIElements()
    @delegateModalEvents()

    return this

  setUIElements: ->
    template        = @getOption('template')
    @views          = @getOption('views')
    @viewContainer  = @getOption('viewContainer')

    throw new Error('No template or views defined for Backbone.Modal') if _.isUndefined(@template) and _.isUndefined(@views)
    throw new Error('No viewContainer defined for Backbone.Modal') if @template and @views and _.isUndefined(@viewContainer)

  getOption: (option) ->
    return unless option
    if @options and option in @options and @options[option]?
      return @options[option]
    else
      return @[option]

  delegateModalEvents: ->
    cancelEl = @getOption('cancelEl')
    submitEl = @getOption('submitEl')