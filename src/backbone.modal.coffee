unless Backbone?
  throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js")

class Backbone.Modal extends Backbone.View
  prefix: 'bbm'
  constructor: ->
    @args = Array::slice.apply(arguments)
    Backbone.View::constructor.apply(this, @args)

    @setUIElements()
    @delegateModalEvents()

  render: (options = {}) ->
    # use openAt or overwrite this with your own functionality
    data = @serializeData()

    @$el.addClass("#{@prefix}-wrapper")
    @modalEl = Backbone.$('<div />').addClass("#{@prefix}-modal")
    @modalEl.html @template(data) if @template
    @$el.html @modalEl

    # global events for key and click outside the modal
    Backbone.$('body').on 'keyup', @checkKey
    Backbone.$('body').on 'click', @clickOutside

    if @viewContainer
      @viewContainerEl = @modalEl.find(@viewContainer)
      @viewContainerEl.addClass("#{@prefix}-modal__views")
    else
      @viewContainerEl = @modalEl

    @$el.show()
    @openAt(0) if @views?.length > 0
    @onRender?()

    @modalEl.css(opacity: 0)
    @$el.fadeIn
      duration: 100
      complete: =>
        @modalEl.css(opacity: 1).addClass("#{@prefix}-modal--open")

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

    data = _.extend(data, @model.toJSON()) if @model
    data = _.extend(data, {items: @collection.toJSON()}) if @collection

    return data

  delegateModalEvents: ->
    @active = true

    # get elements
    cancelEl = @getOption('cancelEl')
    submitEl = @getOption('submitEl')

    # set event handlers for submit and cancel
    @$el.on('click', submitEl, @triggerSubmit) if submitEl
    @$el.on('click', cancelEl, @triggerCancel) if cancelEl

    # set event handlers for views
    for key of @views
      unless key is 'length'
        match     = key.match(/^(\S+)\s*(.*)$/)
        trigger   = match[1]
        selector  = match[2]

        @$el.on trigger, selector, @views[key], @triggerView

  undelegateModalEvents: ->
    @active = false

    # get elements
    cancelEl = @getOption('cancelEl')
    submitEl = @getOption('submitEl')

    # remove event handlers for submit and cancel
    @$el.off('click', submitEl, @triggerSubmit) if submitEl
    @$el.off('click', cancelEl, @triggerCancel) if cancelEl

    # remove event handlers for views
    for key of @views
      unless key is 'length'
        match     = key.match(/^(\S+)\s*(.*)$/)
        trigger   = match[1]
        selector  = match[2]

        @$el.off trigger, selector, @views[key], @triggerView

  checkKey: (e) =>
    if @active
      switch e.keyCode
        when 27 then @triggerCancel()
        when 13 then @triggerSubmit()

  clickOutside: (e) =>
    @triggerCancel(null, true) if Backbone.$(e.target).hasClass("#{@prefix}-wrapper") and @active

  buildView: (viewType) ->
    # returns a Backbone.View instance, a function or an object
    return unless viewType
    if _.isFunction(viewType)
      view = new viewType(@args[0])

      if view instanceof Backbone.View
        return {el: view.render().$el, view: view}
      else
        return {el: viewType(@args[0])}

    return {view: viewType, el: viewType.$el}

  triggerView: (e) =>
    # trigger what view should be rendered
    e?.preventDefault?()
    options       = e.data
    instance      = @buildView(options.view)

    @previousView = @currentView if @currentView
    @currentView  = instance.view || instance.el

    index = 0
    for key of @views
      @currentIndex = index if options.view is @views[key].view
      index++

    if options.onActive
      if _.isFunction(options.onActive)
        options.onActive(this)
      else if _.isString(options.onActive)
        this[options.onActive].call(this, options)

    if @shouldAnimate
      @animateToView(instance.el)
    else
      @shouldAnimate = true
      @$(@viewContainerEl).html instance.el

  animateToView: (view) ->
    style  = position: 'relative', top: -9999, left: -9999
    tester = Backbone.$('<tester/>').css(style)
    tester.html @$el.clone().css(style)
    if Backbone.$('tester').length isnt 0 then Backbone.$('tester').replaceWith tester else Backbone.$('body').append tester

    if @viewContainer
      container     = tester.find(@viewContainer)
    else
      container     = tester.find(".#{@prefix}-modal")

    container.removeAttr('style')

    previousHeight  = container.outerHeight()
    container.html(view)
    newHeight       = container.outerHeight()

    if previousHeight is newHeight
      @$(@viewContainerEl).html view
      @previousView?.close?()
    else
      @$(@viewContainerEl).css(opacity: 0)

      @$(@viewContainerEl).animate {height: newHeight}, 100, =>
        @$(@viewContainerEl).css(opacity: 1).removeAttr('style')
        @$(@viewContainerEl).html view
        @previousView?.close?()

  triggerSubmit: (e) =>
    # triggers submit
    e?.preventDefault()

    if @beforeSubmit
      return if @beforeSubmit() is false

    @submit?()

    if @regionEnabled
      @trigger('modal:close')
    else
      @close()

  triggerCancel: (e) =>
    # triggers cancel
    e?.preventDefault()

    if @beforeCancel
      return if @beforeCancel() is false

    @cancel?()

    if @regionEnabled
      @trigger('modal:close')
    else
      @close()

  close: ->
    # closes view
    Backbone.$('body').off 'keyup', @checkKey
    Backbone.$('body').off 'click', @clickOutside

    @onClose?()

    @shouldAnimate = false
    @modalEl.addClass("{@prefix}-modal--close")
    @$el.fadeOut(duration: 200)

    _.delay =>
      @currentView?.remove?()
      @remove()
    , 200

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
    @openAt(@currentIndex+1) if @currentIndex+1 < @views.length

  previous: ->
    @openAt(@currentIndex-1) if @currentIndex-1 < @views.length-1
