((factory) ->
  if typeof define is "function" and define.amd
    define(["underscore", "backbone", "exports"], factory)
  else if typeof exports is "object"
    factory(require("underscore"), require("backbone"), exports)
  else
    factory(_, Backbone, {})
) (_, Backbone, Modal) ->

  class Modal extends Backbone.View
    prefix: 'bbm'
    animate: true
    keyControl: true
    showViewOnRender: true

    constructor: ->
      @args = Array::slice.apply(arguments)
      Backbone.View::constructor.apply(this, @args)

      # get all options
      @setUIElements()

    render: (options) ->
      # use openAt or overwrite this with your own functionality
      data = @serializeData()
      options = 0 if !options or _.isEmpty(options)

      @$el.addClass("#{@prefix}-wrapper")
      @modalEl = Backbone.$('<div />').addClass("#{@prefix}-modal")
      @modalEl.html @buildTemplate(@template, data) if @template
      @$el.html(@modalEl)

      if @viewContainer
        @viewContainerEl = @modalEl.find(@viewContainer)
        @viewContainerEl.addClass("#{@prefix}-modal__views")
      else
        @viewContainerEl = @modalEl

      # blur links to prevent double keystroke events
      Backbone.$(':focus').blur()

      @openAt(options) if @views?.length > 0 and @showViewOnRender
      @onRender?()

      @delegateModalEvents()

      # show modal
      if @$el.fadeIn and @animate
        @modalEl.css(opacity: 0)
        @$el.fadeIn
          duration: 100
          complete: @rendererCompleted
      else
        @rendererCompleted()

      return this

    rendererCompleted: =>
      if @keyControl
        # global events for key and click outside the modal
        Backbone.$('body').on('keyup.bbm', @checkKey)
        Backbone.$('body').on('mouseup.bbm', @clickOutside)

      @modalEl.css(opacity: 1).addClass("#{@prefix}-modal--open")
      @onShow?()
      @currentView?.onShow?()

    setUIElements: ->
      # get modal options
      @template       = @getOption('template')
      @views          = @getOption('views')
      @views?.length  = _.size(@views)
      @viewContainer  = @getOption('viewContainer')
      @animate        = @getOption('animate')

      # check if everything is right
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
        if _.isString(key) and key isnt 'length'
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
        if _.isString(key) and key isnt 'length'
          match     = key.match(/^(\S+)\s*(.*)$/)
          trigger   = match[1]
          selector  = match[2]

          @$el.off trigger, selector, @views[key], @triggerView

    checkKey: (e) =>
      if @active
        switch e.keyCode
          when 27 then @triggerCancel(e)
          when 13 then @triggerSubmit(e)

    clickOutside: (e) =>
      @triggerCancel() if Backbone.$(e.target).hasClass("#{@prefix}-wrapper") and @active

    buildTemplate: (template, data) ->
      if typeof template is 'function'
        templateFunction = template
      else
        templateFunction = _.template(Backbone.$(template).html())

      return templateFunction(data)

    buildView: (viewType, options) ->
      # returns a Backbone.View instance, a function or an object
      return unless viewType
      options = options() if options and _.isFunction(options)

      if _.isFunction(viewType)
        view = new viewType(options or @args[0])

        if view instanceof Backbone.View
          return {el: view.render().$el, view: view}
        else
          return {el: viewType(options or @args[0])}

      return {view: viewType, el: viewType.$el}

    triggerView: (e) =>
      # trigger what view should be rendered
      e?.preventDefault?()
      options       = e.data
      instance      = @buildView(options.view, options.viewOptions)

      if @currentView
        @previousView = @currentView
        unless options.openOptions?.skipSubmit
          return if @previousView.beforeSubmit?() is false
          @previousView.submit?()

      @currentView = instance.view || instance.el

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
        @$(@viewContainerEl).html(view)
        @currentView.onShow?()
        @previousView?.destroy?()
      else
        if @animate
          @$(@viewContainerEl).css(opacity: 0)
          @$(@viewContainerEl).animate {height: newHeight}, 100, =>
            @$(@viewContainerEl).css(opacity: 1).removeAttr('style')
            @$(@viewContainerEl).html view
            @currentView.onShow?()
            @previousView?.destroy?()
        else
          @$(@viewContainerEl).css(height: newHeight).html(view)

    triggerSubmit: (e) =>
      e?.preventDefault()

      return if @beforeSubmit() is false if @beforeSubmit
      return if @currentView.beforeSubmit() is false if @currentView and @currentView.beforeSubmit

      return @triggerCancel() if !@submit and !@currentView?.submit and !@getOption('submitEl')

      @currentView?.submit?()
      @submit?()

      if @regionEnabled
        @trigger('modal:destroy')
      else
        @destroy()

    triggerCancel: (e) =>
      e?.preventDefault()

      return if @beforeCancel() is false if @beforeCancel
      @cancel?()

      if @regionEnabled
        @trigger('modal:destroy')
      else
        @destroy()

    destroy: ->
      Backbone.$('body').off('keyup.bbm', @checkKey)
      Backbone.$('body').off('mouseup.bbm', @clickOutside)

      Backbone.$('tester').remove()

      @onDestroy?()

      @shouldAnimate = false
      @modalEl.addClass("#{@prefix}-modal--destroy")

      removeViews = =>
        @currentView?.remove?()
        @remove()

      if @$el.fadeOut and @animate
        @$el.fadeOut(duration: 200)
        _.delay ->
          removeViews()
        , 200
      else
        removeViews()

    openAt: (options) ->
      if _.isNumber(options)
        atIndex = options
      else if _.isNumber(options._index)
        atIndex = options._index

      i = 0
      for key of @views
        unless key is 'length'
          # go to specific index in views[]
          if _.isNumber(atIndex)
            view = @views[key] if i is atIndex
            i++
          # use attributes to find a view in views[]
          else if _.isObject(options)
            for attr of @views[key]
              view = @views[key] if options[attr] is @views[key][attr]

      if view
        @currentIndex = _.indexOf(@views, view)
        @triggerView(data: _.extend(view, {openOptions: options}))

      return this

    next: (options = {}) ->
      @openAt(_.extend(options, {_index: @currentIndex+1})) if @currentIndex+1 < @views.length

    previous: (options = {}) ->
      @openAt(_.extend(options, {_index: @currentIndex-1})) if @currentIndex-1 < @views.length-1


  Backbone.Modal = Modal
  return Backbone.Modal
