(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(root, factory) {
    if (typeof define === "function" && define.amd) {
      return define(["exports", "underscore", "backbone", "backbone.marionette"], factory);
    } else if (typeof exports === "object") {
      return factory(exports, require("underscore"), require("backbone"), require("backbone.marionette"));
    } else {
      return root.Backbone.Marionette.Modals = factory((root.commonJsStrict = {}), root._, root.Backbone, root.Backbone.Marionette);
    }
  })(this, function(exports, _, Backbone, Marionette) {
    var Modals;
    return Modals = (function(_super) {
      __extends(Modals, _super);

      function Modals() {
        this.close = __bind(this.close, this);
        return Modals.__super__.constructor.apply(this, arguments);
      }

      Modals.prototype.modals = [];

      Modals.prototype.zIndex = 0;

      Modals.prototype.show = function(modal, options) {
        var lastModal, m, secondLastModal, view, _i, _j, _len, _len1, _ref, _ref1;
        this.ensureEl();
        if (this.modals.length > 0) {
          lastModal = _.last(this.modals);
          lastModal.modalEl.addClass("" + lastModal.prefix + "-modal--stacked");
          secondLastModal = this.modals[this.modals.length - 1];
          if (secondLastModal != null) {
            secondLastModal.modalEl.removeClass("" + secondLastModal.prefix + "-modal--stacked-reverse");
          }
        }
        modal.render(options);
        modal.regionEnabled = true;
        this.$el.show();
        this.$el.append(modal.el);
        if (this.modals.length > 0) {
          _ref = this.modals;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            view = _ref[_i];
            view.$el.css({
              background: 'none'
            });
          }
        }
        Marionette.triggerMethod.call(modal, "show");
        Marionette.triggerMethod.call(this, "show", modal);
        this.currentView = modal;
        _ref1 = this.modals;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          m = _ref1[_j];
          m.undelegateModalEvents();
        }
        modal.on('modal:close', this.close);
        this.modals.push(modal);
        return this.zIndex++;
      };

      Modals.prototype.close = function() {
        var lastModal, modal;
        modal = this.currentView;
        if (!modal || modal.isClosed) {
          return;
        }
        if (modal.close) {
          modal.close();
        } else if (modal.remove) {
          modal.remove();
        }
        Marionette.triggerMethod.call(modal, "close");
        Marionette.triggerMethod.call(this, "close", modal);
        modal.off('modal:close', this.close);
        this.modals.splice(_.indexOf(this.modals, modal), 1);
        this.zIndex--;
        this.currentView = this.modals[this.zIndex - 1];
        lastModal = _.last(this.modals);
        if (lastModal) {
          lastModal.$el.removeAttr('style');
          lastModal.modalEl.addClass("" + lastModal.prefix + "-modal--stacked-reverse");
          _.delay((function(_this) {
            return function() {
              return lastModal.modalEl.removeClass("" + lastModal.prefix + "-modal--stacked");
            };
          })(this), 300);
          if (this.zIndex !== 0) {
            return lastModal.delegateModalEvents();
          }
        }
      };

      Modals.prototype.closeAll = function() {
        var modal, _i, _len, _ref, _results;
        _ref = this.modals;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          modal = _ref[_i];
          _results.push(this.close());
        }
        return _results;
      };

      return Modals;

    })(Marionette.Region);
  });

}).call(this);
