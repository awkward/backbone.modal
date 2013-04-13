(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof Backbone === "undefined" || Backbone === null) {
    throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js");
  }

  Backbone.Modal = (function(_super) {
    __extends(Modal, _super);

    function Modal() {
      this.triggerView = __bind(this.triggerView, this);
      var args;

      args = Array.prototype.slice.apply(arguments);
      Backbone.View.prototype.constructor.apply(this, args);
      this.setUIElements();
      this.delegateModalEvents();
    }

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
      var cancelEl, key, match, selector, submitEl, trigger, _results;

      cancelEl = this.getOption('cancelEl');
      submitEl = this.getOption('submitEl');
      this.$el.on('click', submitEl, this.triggerSubmit);
      this.$el.on('click', cancelEl, this.triggerSubmit);
      _results = [];
      for (key in this.views) {
        match = key.match(/^(\S+)\s*(.*)$/);
        trigger = match[1];
        selector = match[2];
        _results.push(this.$el.on(trigger, selector, this.views[key], this.triggerView));
      }
      return _results;
    };

    Modal.prototype.buildView = function(viewType) {
      if (_.isFunction(viewType)) {
        if (new viewType instanceof Backbone.View) {
          return new viewType(this.options);
        } else {
          return viewType(this.options);
        }
      }
      return viewType;
    };

    Modal.prototype.triggerView = function(e) {
      var options;

      if (typeof e.preventDefault === "function") {
        e.preventDefault();
      }
      return options = e.data;
    };

    Modal.prototype.triggerSubmit = function(e) {
      return e.preventDefault();
    };

    Modal.prototype.triggerCancel = function(e) {
      return e.preventDefault();
    };

    Modal.prototype.openAt = function(index) {
      var i, key, view;

      i = 0;
      for (key in this.views) {
        if (i === index) {
          view = this.views[key];
        }
        i++;
      }
      if (view) {
        return this.triggerView({
          data: view
        });
      }
    };

    return Modal;

  })(Backbone.View);

}).call(this);
