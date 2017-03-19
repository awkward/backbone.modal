(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  (function(factory) {
    if (typeof define === "function" && define.amd) {
      return define(["underscore", "backbone", "backbone.marionette", "exports"], factory);
    } else if (typeof exports === "object") {
      return factory(require("underscore"), require("backbone"), require("backbone.marionette"), exports);
    } else {
      return factory(_, Backbone, Backbone.Marionette, {});
    }
  })(function(_, Backbone, Marionette, Modals) {
    Modals = (function(superClass) {
      extend(Modals, superClass);

      function Modals() {
        this.destroy = bind(this.destroy, this);
        return Modals.__super__.constructor.apply(this, arguments);
      }

      Modals.prototype.modals = [];

      Modals.prototype.zIndex = 0;

      Modals.prototype.show = function(view, options) {
        var i, j, lastModal, len, len1, modalView, ref, ref1, secondLastModal;
        if (options == null) {
          options = {};
        }
        if (!this._ensureElement(options)) {
          return;
        }
        Backbone.$('body').css({
          overflow: 'hidden'
        });
        if (this.modals.length > 0) {
          lastModal = _.last(this.modals);
          lastModal.modalEl.addClass(lastModal.prefix + "-view--stacked");
          secondLastModal = this.modals[this.modals.length - 1];
          if (secondLastModal != null) {
            secondLastModal.modalEl.removeClass(secondLastModal.prefix + "-modal--stacked-reverse");
          }
        }
        view.render(options);
        view.regionEnabled = true;
        this.triggerMethod('before:show', this, view, options);
        this.$el.append(view.el);
        this.currentView = view;
        ref = this.modals;
        for (i = 0, len = ref.length; i < len; i++) {
          modalView = ref[i];
          modalView.undelegateModalEvents();
        }
        ref1 = this.modals;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          modalView = ref1[j];
          modalView.$el.css({
            background: 'none'
          });
        }
        view.on('modal:destroy', this.destroy);
        this.modals.push(view);
        return this.zIndex++;
      };

      Modals.prototype.destroy = function() {
        var lastModal, view;
        view = this.currentView;
        if (!view) {
          return;
        }
        if (view.destroy && !view.isDestroyed) {
          view.destroy();
        } else if (view.remove) {
          view.remove();
        }
        view.off('modal:destroy', this.destroy);
        this.modals.splice(_.indexOf(this.modals, view), 1);
        this.zIndex--;
        this.currentView = this.modals[this.zIndex - 1];
        lastModal = _.last(this.modals);
        if (lastModal) {
          lastModal.$el.removeAttr('style');
          lastModal.modalEl.addClass(lastModal.prefix + "-modal--stacked-reverse");
          _.delay((function(_this) {
            return function() {
              return lastModal.modalEl.removeClass(lastModal.prefix + "-modal--stacked");
            };
          })(this), 300);
          if (this.zIndex !== 0) {
            lastModal.delegateModalEvents();
          }
        }
        if (this.zIndex === 0) {
          Backbone.$('body').css({
            overflow: 'visible'
          });
        }
        return this.triggerMethod('modal:destroy', view);
      };

      Modals.prototype.destroyAll = function() {
        var i, len, ref, results, view;
        ref = this.modals;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          view = ref[i];
          results.push(this.destroy());
        }
        return results;
      };

      return Modals;

    })(Marionette.Region);
    Marionette.Modals = Modals;
    return Marionette.Modals;
  });

}).call(this);
