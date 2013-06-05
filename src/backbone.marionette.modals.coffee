unless Backbone?
  throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js") 

class Backbone.Marionette.Modals extends Backbone.Marionette.Region
  modals: []
  zIndex: 0

  show: (modal, options = {}) ->
    @ensureEl()

    modal.render()
    @$el.show()
    @$el.append modal.el
    
    Marionette.triggerMethod.call(modal, "show")
    Marionette.triggerMethod.call(this, "show", modal)

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

    modal.off('modal:close', @close)

    @modals.splice(_.indexOf(@modals, modal), 1)

    @zIndex--

    @currentView = @modals[@zIndex-1]

    if @zIndex is 0
      @$el.hide()
    else
      _.last(@modals).delegateModalEvents()
      
    Marionette.triggerMethod.call(this, "close")

  closeAll: ->
    @close() for modal in @modals