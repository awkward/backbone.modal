(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(root, factory) {
    var marionette;
    if (typeof exports === 'object') {
      marionette = require('marionette');
      return module.exports = factory(marionette);
    } else if (typeof define === 'function' && define.amd) {
      return define(['marionette'], factory);
    } else {
      if (typeof Backbone === "undefined" || Backbone === null) {
        throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js");
      }
      if (Backbone.Marionette == null) {
        throw new Error("Backbone.Marionette is not defined. Please include the latest version from http://marionettejs.com/downloads/backbone.marionette.js");
      }
      return factory(Backbone.Marionette);
    }
  })(this, function(Marionette) {
    var _ref;
    return Marionette.Modals = (function(_super) {
      __extends(Modals, _super);

      function Modals() {
        this.close = __bind(this.close, this);
        _ref = Modals.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Modals.prototype.modals = [];

      Modals.prototype.zIndex = 0;

      Modals.prototype.show = function(modal, options) {
        var lastModal, m, secondLastModal, view, _i, _j, _len, _len1, _ref1, _ref2;
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
          _ref1 = this.modals;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            view = _ref1[_i];
            view.$el.css({
              background: 'none'
            });
          }
        }
        Marionette.triggerMethod.call(modal, "show");
        Marionette.triggerMethod.call(this, "show", modal);
        this.currentView = modal;
        _ref2 = this.modals;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          m = _ref2[_j];
          m.undelegateModalEvents();
        }
        modal.on('modal:close', this.close);
        this.modals.push(modal);
        return this.zIndex++;
      };

      Modals.prototype.close = function() {
        var lastModal, modal,
          _this = this;
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
          _.delay(function() {
            return lastModal.modalEl.removeClass("" + lastModal.prefix + "-modal--stacked");
          }, 300);
          if (this.zIndex !== 0) {
            return lastModal.delegateModalEvents();
          }
        }
      };

      Modals.prototype.closeAll = function() {
        var modal, _i, _len, _ref1, _results;
        _ref1 = this.modals;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          modal = _ref1[_i];
          _results.push(this.close());
        }
        return _results;
      };

      return Modals;

    })(Marionette.Region);
  });

}).call(this);
