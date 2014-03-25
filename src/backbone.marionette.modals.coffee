unless Backbone?
  throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js")

class Backbone.Marionette.Modals extends Backbone.Marionette.Region
  modals: []
  zIndex: 0

  show: (modal, options) ->
    @ensureEl()

    if @modals.length > 0
      lastModal = _.last(@modals)
      lastModal.modalEl.addClass("#{lastModal.prefix}-modal--stacked")
      secondLastModal = @modals[@modals.length-1]
      secondLastModal?.modalEl.removeClass("#{secondLastModal.prefix}-modal--stacked-reverse")

    modal.render(options)
    modal.regionEnabled = true

    @$el.show()
    @$el.append modal.el

    view.$el.css(background: 'none') for view in @modals if @modals.length > 0

    Backbone.Marionette.triggerMethod.call(modal, "show")
    Backbone.Marionette.triggerMethod.call(this, "show", modal)

    @currentView = modal

    m.undelegateModalEvents() for m in @modals

    modal.on('modal:close', @close)

    @modals.push(modal)
    @zIndex++

  close: =>
    modal = @currentView
    return if !modal or modal.isClosed

    if modal.close
      modal.close()
    else if modal.remove
      modal.remove()

    Backbone.Marionette.triggerMethod.call(modal, "close")
    Backbone.Marionette.triggerMethod.call(this, "close", modal)

    modal.off('modal:close', @close)

    @modals.splice(_.indexOf(@modals, modal), 1)

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

  closeAll: ->
    @close() for modal in @modals
