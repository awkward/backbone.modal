(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone === "undefined" || Backbone === null) {
    throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js");
  }

  Backbone.Marionette.Modals = (function(_super) {
    __extends(Modals, _super);

    function Modals() {
      _ref = Modals.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Modals.prototype.modals = [];

    Modals.prototype.zIndex = 0;

    Modals.prototype.show = function(modal, options) {
      if (options == null) {
        options = {};
      }
      this.ensureEl();
      modal.render();
      this.$el.append(modal.el);
      Marionette.triggerMethod.call(modal, "show");
      Marionette.triggerMethod.call(this, "show", modal);
      this.currentView = modal;
      this.modals.push(modal);
      return this.zIndex++;
    };

    Modals.prototype.close = function() {
      var modal;

      modal = this.currentView;
      if (!modal || modal.isClosed) {
        return;
      }
      if (modal.close) {
        modal.close();
      } else if (modal.remove) {
        modal.remove();
      }
      this.modals.splice(_.indexOf(this.modals, modal), 1);
      this.zIndex--;
      this.currentView = this.modals[this.zIndex - 1];
      return Marionette.triggerMethod.call(this, "close");
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

  })(Backbone.Marionette.Region);

}).call(this);
