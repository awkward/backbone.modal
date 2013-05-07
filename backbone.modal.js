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
      this.setUIElements();
      this.delegateModalEvents();
    }

    Modal.prototype.render = function() {
      var data;

      data = this.serializeData();
      if (this.template) {
        this.$el.html(this.template(data));
      }
      this.$el.show();
      this.openAt(0);
      return this;
    };

    Modal.prototype.setUIElements = function() {
      var _ref;

      this.template = this.getOption('template');
      this.views = this.getOption('views');
      if ((_ref = this.views) != null) {
        _ref.length = _.size(this.views);
      }
      this.viewContainer = this.getOption('viewContainer');
      this.$el.hide();
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

    Modal.prototype.serializeData = function() {
      var data;

      data = {};
      if (this.model) {
        data = this.model.toJSON();
      } else if (this.collection) {
        data = {
          items: this.collection.toJSON()
        };
      }
      return data;
    };

    Modal.prototype.delegateModalEvents = function() {
      var cancelEl, key, match, selector, submitEl, trigger, _results,
        _this = this;

      cancelEl = this.getOption('cancelEl');
      submitEl = this.getOption('submitEl');
      if (submitEl) {
        this.$el.on('click', submitEl, function(e) {
          return _this.triggerSubmit(e);
        });
      }
      if (cancelEl) {
        this.$el.on('click', cancelEl, function(e) {
          return _this.triggerCancel(e);
        });
      }
      $('body').on('keyup', function(e) {
        return _this.checkKey(e);
      });
      _results = [];
      for (key in this.views) {
        if (key !== 'length') {
          match = key.match(/^(\S+)\s*(.*)$/);
          trigger = match[1];
          selector = match[2];
          _results.push(this.$el.on(trigger, selector, this.views[key], function(e) {
            return _this.triggerView(e);
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Modal.prototype.checkKey = function(e) {
      switch (e.keyCode) {
        case 27:
          return this.triggerCancel();
        case 13:
          return this.triggerSubmit();
      }
    };

    Modal.prototype.buildView = function(viewType) {
      var data, view;

      if (!viewType) {
        return;
      }
      if (_.isFunction(viewType)) {
        data = this.serializeData();
        if (new viewType instanceof Backbone.View) {
          view = new viewType(data);
          return {
            el: view.$el,
            view: view
          };
        } else {
          return {
            el: viewType(data)
          };
        }
      }
      return {
        view: viewType,
        el: viewType.$el
      };
    };

    Modal.prototype.triggerView = function(e) {
      var instance, options;

      if (e != null) {
        if (typeof e.preventDefault === "function") {
          e.preventDefault();
        }
      }
      options = e.data;
      instance = this.buildView(options.view);
      this.currentView = instance.view;
      if (this.viewContainer) {
        return this.$(this.viewContainer).html(instance.el);
      } else {
        return this.$el.html(instance.el);
      }
    };

    Modal.prototype.triggerSubmit = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      if (this.beforeSubmit) {
        if (this.beforeSubmit() === false) {
          return;
        }
      }
      if (typeof this.submit === "function") {
        this.submit();
      }
      return this.close();
    };

    Modal.prototype.triggerCancel = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      if (this.beforeCancel) {
        if (this.beforeCancel() === false) {
          return;
        }
      }
      if (typeof this.cancel === "function") {
        this.cancel();
      }
      return this.close();
    };

    Modal.prototype.close = function() {
      var _ref,
        _this = this;

      $('body').off('keyup', function(e) {
        return _this.checkKey(e);
      });
      if ((_ref = this.currentView) != null) {
        if (typeof _ref.remove === "function") {
          _ref.remove();
        }
      }
      return this.remove();
    };

    Modal.prototype.openAt = function(index) {
      var i, key, view;

      i = 0;
      for (key in this.views) {
        if (key !== 'length') {
          if (i === index) {
            view = this.views[key];
          }
          i++;
        }
      }
      if (view) {
        this.currentIndex = index;
        this.triggerView({
          data: view
        });
      }
      return this;
    };

    Modal.prototype.next = function() {
      if (this.currentIndex + 1 < this.views.length - 1) {
        return this.openAt(this.currentIndex + 1);
      }
    };

    Modal.prototype.previous = function() {
      if (this.currentIndex - 1 < this.views.length - 1) {
        return this.openAt(this.currentIndex - 1);
      }
    };

    Modal.prototype.animate = function() {};

    return Modal;

  })(Backbone.View);

}).call(this);
