((factory) ->
  if typeof define is "function" and define.amd
    define(["underscore", "backbone", "backbone.marionette", "exports"], factory)
  else if typeof exports is "object"
    factory(require("underscore"), require("backbone"), require("backbone.marionette"), exports)
  else
    factory(_, Backbone, Backbone.Marionette, {})
) (_, Backbone, Marionette, Modals) ->

  class Modals extends Marionette.Region
    modals: []
    zIndex: 0

    show: (view, options = {}) ->
      @_ensureElement()

      Backbone.$('body').css(overflow: 'hidden')

      if @modals.length > 0
        lastModal = _.last(@modals)
        lastModal.modalEl.addClass("#{lastModal.prefix}-view--stacked")
        secondLastModal = @modals[@modals.length-1]
        secondLastModal?.modalEl.removeClass("#{secondLastModal.prefix}-modal--stacked-reverse")

      view.render(options)
      view.regionEnabled = true

      @triggerMethod('before:swap', view)
      @triggerMethod('before:show', view)
      Marionette.triggerMethodOn(view, 'before:show')
      @triggerMethod('swapOut', @currentView)

      @$el.append view.el
      @currentView = view

      @triggerMethod('swap', view)
      @triggerMethod('show', view)
      Marionette.triggerMethodOn(view, 'show')

      modalView.undelegateModalEvents() for modalView in @modals
      modalView.$el.css(background: 'none') for modalView in @modals

      view.on('modal:destroy', @destroy)
      @modals.push(view)
      @zIndex++

    destroy: =>
      view = @currentView
      return unless view

      if view.destroy and !view.isDestroyed
        view.destroy()
      else if view.remove
        view.remove()

      view.off('modal:destroy', @destroy)

      @modals.splice(_.indexOf(@modals, view), 1)

      @zIndex--

      @currentView  = @modals[@zIndex-1]
      lastModal     = _.last(@modals)

      if lastModal
        lastModal.$el.removeAttr('style')
        lastModal.modalEl.addClass("#{lastModal.prefix}-modal--stacked-reverse")
        _.delay =>
          lastModal.modalEl.removeClass("#{lastModal.prefix}-modal--stacked")
        , 300

        lastModal.delegateModalEvents() if @zIndex isnt 0

      Backbone.$('body').css(overflow: 'visible') if @zIndex is 0
      @triggerMethod('modal:destroy', view)

    destroyAll: ->
      @destroy() for view in @modals


  Marionette.Modals = Modals
  return Marionette.Modals
