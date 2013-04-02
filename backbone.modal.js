(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof Backbone === "undefined" || Backbone === null) {
    throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js");
  }

  Backbone.Modal = (function(_super) {
    __extends(Modal, _super);

    function Modal() {
      var args;

      args = Array.prototype.slice.apply(arguments);
      Backbone.View.prototype.constructor.apply(this, args);
    }

    Modal.prototype.render = function() {
      this.setUIElements();
      this.delegateModalEvents();
      return this;
    };

    Modal.prototype.setUIElements = function() {
      var template;

      template = this.getOption('template');
      this.views = this.getOption('views');
      this.viewContainer = this.getOption('viewContainer');
      if (_.isUndefined(this.template) && _.isUndefined(this.views)) {
        throw new Error('No template or views defined for Backbone.Modal');
      }
      if (this.template && this.views && _.isUndefined(this.viewContainer)) {
        throw new Error('No viewContainer defined for Backbone.Modal');
      }
    };

    Modal.prototype.getOption = function(option) {
      if (!option) {
        return;
      }
      if (this.options && __indexOf.call(this.options, option) >= 0 && (this.options[option] != null)) {
        return this.options[option];
      } else {
        return this[option];
      }
    };

    Modal.prototype.delegateModalEvents = function() {
      var cancelEl, submitEl;

      cancelEl = this.getOption('cancelEl');
      return submitEl = this.getOption('submitEl');
    };

    return Modal;

  })(Backbone.View);

}).call(this);
