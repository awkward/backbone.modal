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

    Modal.prototype.prefix = 'bbm';

    Modal.prototype.animate = true;

    function Modal() {
      this.triggerCancel = __bind(this.triggerCancel, this);
      this.triggerSubmit = __bind(this.triggerSubmit, this);
      this.triggerView = __bind(this.triggerView, this);
      this.clickOutside = __bind(this.clickOutside, this);
      this.checkKey = __bind(this.checkKey, this);
      this.args = Array.prototype.slice.apply(arguments);
      Backbone.View.prototype.constructor.apply(this, this.args);
      this.setUIElements();
      this.delegateModalEvents();
    }

    Modal.prototype.render = function(options) {
      var animate, data, _ref,
        _this = this;
      data = this.serializeData();
      this.$el.addClass("" + this.prefix + "-wrapper");
      this.modalEl = Backbone.$('<div />').addClass("" + this.prefix + "-modal");
      if (this.template) {
        this.modalEl.html(this.template(data));
      }
      this.$el.html(this.modalEl);
      Backbone.$('body').on('keyup', this.checkKey);
      Backbone.$('body').on('click', this.clickOutside);
      if (this.viewContainer) {
        this.viewContainerEl = this.modalEl.find(this.viewContainer);
        this.viewContainerEl.addClass("" + this.prefix + "-modal__views");
      } else {
        this.viewContainerEl = this.modalEl;
      }
      this.$el.show();
      if (((_ref = this.views) != null ? _ref.length : void 0) > 0) {
        this.openAt(options || 0);
      }
      if (typeof this.onRender === "function") {
        this.onRender();
      }
      animate = this.getOption('animate');
      if (this.$el.fadeIn && animate) {
        this.modalEl.css({
          opacity: 0
        });
        this.$el.fadeIn({
          duration: 100,
          complete: function() {
            var _ref1;
            _this.modalEl.css({
              opacity: 1
            }).addClass("" + _this.prefix + "-modal--open");
            if (typeof _this.onShow === "function") {
              _this.onShow();
            }
            return (_ref1 = _this.currentView) != null ? typeof _ref1.onShow === "function" ? _ref1.onShow() : void 0 : void 0;
          }
        });
      } else {
        this.modalEl.addClass("" + this.prefix + "-modal--open");
      }
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
        data = _.extend(data, this.model.toJSON());
      }
      if (this.collection) {
        data = _.extend(data, {
          items: this.collection.toJSON()
        });
      }
      return data;
    };

    Modal.prototype.delegateModalEvents = function() {
      var cancelEl, key, match, selector, submitEl, trigger, _results;
      this.active = true;
      cancelEl = this.getOption('cancelEl');
      submitEl = this.getOption('submitEl');
      if (submitEl) {
        this.$el.on('click', submitEl, this.triggerSubmit);
      }
      if (cancelEl) {
        this.$el.on('click', cancelEl, this.triggerCancel);
      }
      _results = [];
      for (key in this.views) {
        if (_.isString(key) && key !== 'length') {
          match = key.match(/^(\S+)\s*(.*)$/);
          trigger = match[1];
          selector = match[2];
          _results.push(this.$el.on(trigger, selector, this.views[key], this.triggerView));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Modal.prototype.undelegateModalEvents = function() {
      var cancelEl, key, match, selector, submitEl, trigger, _results;
      this.active = false;
      cancelEl = this.getOption('cancelEl');
      submitEl = this.getOption('submitEl');
      if (submitEl) {
        this.$el.off('click', submitEl, this.triggerSubmit);
      }
      if (cancelEl) {
        this.$el.off('click', cancelEl, this.triggerCancel);
      }
      _results = [];
      for (key in this.views) {
        if (_.isString(key) && key !== 'length') {
          match = key.match(/^(\S+)\s*(.*)$/);
          trigger = match[1];
          selector = match[2];
          _results.push(this.$el.off(trigger, selector, this.views[key], this.triggerView));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Modal.prototype.checkKey = function(e) {
      if (this.active) {
        switch (e.keyCode) {
          case 27:
            return this.triggerCancel(e);
          case 13:
            return this.triggerSubmit(e);
        }
      }
    };

    Modal.prototype.clickOutside = function(e) {
      if (Backbone.$(e.target).hasClass("" + this.prefix + "-wrapper") && this.active) {
        return this.triggerCancel(null, true);
      }
    };

    Modal.prototype.buildView = function(viewType, options) {
      var view;
      if (!viewType) {
        return;
      }
      if (options && _.isFunction(options)) {
        options = options();
      }
      if (_.isFunction(viewType)) {
        view = new viewType(options || this.args[0]);
        if (view instanceof Backbone.View) {
          return {
            el: view.render().$el,
            view: view
          };
        } else {
          return {
            el: viewType(options || this.args[0])
          };
        }
      }
      return {
        view: viewType,
        el: viewType.$el
      };
    };

    Modal.prototype.triggerView = function(e) {
      var index, instance, key, options, _base, _base1, _ref;
      if (e != null) {
        if (typeof e.preventDefault === "function") {
          e.preventDefault();
        }
      }
      options = e.data;
      instance = this.buildView(options.view, options.viewOptions);
      if (this.currentView) {
        this.previousView = this.currentView;
        if (!((_ref = options.openOptions) != null ? _ref.skipSubmit : void 0)) {
          if ((typeof (_base = this.previousView).beforeSubmit === "function" ? _base.beforeSubmit() : void 0) === false) {
            return;
          }
          if (typeof (_base1 = this.previousView).submit === "function") {
            _base1.submit();
          }
        }
      }
      this.currentView = instance.view || instance.el;
      index = 0;
      for (key in this.views) {
        if (options.view === this.views[key].view) {
          this.currentIndex = index;
        }
        index++;
      }
      if (options.onActive) {
        if (_.isFunction(options.onActive)) {
          options.onActive(this);
        } else if (_.isString(options.onActive)) {
          this[options.onActive].call(this, options);
        }
      }
      if (this.shouldAnimate) {
        return this.animateToView(instance.el);
      } else {
        this.shouldAnimate = true;
        return this.$(this.viewContainerEl).html(instance.el);
      }
    };

    Modal.prototype.animateToView = function(view) {
      var container, newHeight, previousHeight, style, tester, _base, _ref,
        _this = this;
      style = {
        position: 'relative',
        top: -9999,
        left: -9999
      };
      tester = Backbone.$('<tester/>').css(style);
      tester.html(this.$el.clone().css(style));
      if (Backbone.$('tester').length !== 0) {
        Backbone.$('tester').replaceWith(tester);
      } else {
        Backbone.$('body').append(tester);
      }
      if (this.viewContainer) {
        container = tester.find(this.viewContainer);
      } else {
        container = tester.find("." + this.prefix + "-modal");
      }
      container.removeAttr('style');
      previousHeight = container.outerHeight();
      container.html(view);
      newHeight = container.outerHeight();
      if (previousHeight === newHeight) {
        this.$(this.viewContainerEl).html(view);
        if (typeof (_base = this.currentView).onShow === "function") {
          _base.onShow();
        }
        return (_ref = this.previousView) != null ? typeof _ref.close === "function" ? _ref.close() : void 0 : void 0;
      } else {
        this.$(this.viewContainerEl).css({
          opacity: 0
        });
        return this.$(this.viewContainerEl).animate({
          height: newHeight
        }, 100, function() {
          var _base1, _ref1;
          _this.$(_this.viewContainerEl).css({
            opacity: 1
          }).removeAttr('style');
          _this.$(_this.viewContainerEl).html(view);
          if (typeof (_base1 = _this.currentView).onShow === "function") {
            _base1.onShow();
          }
          return (_ref1 = _this.previousView) != null ? typeof _ref1.close === "function" ? _ref1.close() : void 0 : void 0;
        });
      }
    };

    Modal.prototype.triggerSubmit = function(e) {
      var _ref;
      if (e != null) {
        e.preventDefault();
      }
      if (this.beforeSubmit ? this.beforeSubmit() === false : void 0) {
        return;
      }
      if (this.currentView && this.currentView.beforeSubmit ? this.currentView.beforeSubmit() === false : void 0) {
        return;
      }
      if ((_ref = this.currentView) != null) {
        if (typeof _ref.submit === "function") {
          _ref.submit();
        }
      }
      if (typeof this.submit === "function") {
        this.submit();
      }
      if (this.regionEnabled) {
        return this.trigger('modal:close');
      } else {
        return this.close();
      }
    };

    Modal.prototype.triggerCancel = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      if (this.beforeCancel ? this.beforeCancel() === false : void 0) {
        return;
      }
      if (typeof this.cancel === "function") {
        this.cancel();
      }
      if (this.regionEnabled) {
        return this.trigger('modal:close');
      } else {
        return this.close();
      }
    };

    Modal.prototype.close = function() {
      var animate, removeViews,
        _this = this;
      Backbone.$('body').off('keyup', this.checkKey);
      Backbone.$('body').off('click', this.clickOutside);
      if (typeof this.onClose === "function") {
        this.onClose();
      }
      this.shouldAnimate = false;
      this.modalEl.addClass("" + this.prefix + "-modal--close");
      removeViews = function() {
        var _ref;
        if ((_ref = _this.currentView) != null) {
          if (typeof _ref.remove === "function") {
            _ref.remove();
          }
        }
        return _this.remove();
      };
      animate = this.getOption('animate');
      if (this.$el.fadeOut && animate) {
        this.$el.fadeOut({
          duration: 200
        });
        return _.delay(function() {
          return removeViews();
        }, 200);
      } else {
        return removeViews();
      }
    };

    Modal.prototype.openAt = function(options) {
      var atIndex, attr, i, key, view;
      if (_.isNumber(options)) {
        atIndex = options;
      } else if (_.isNumber(options._index)) {
        atIndex = options._index;
      }
      i = 0;
      for (key in this.views) {
        if (key !== 'length') {
          if (_.isNumber(atIndex)) {
            if (i === atIndex) {
              view = this.views[key];
            }
            i++;
          } else if (_.isObject(options)) {
            for (attr in this.views[key]) {
              if (options[attr] === this.views[key][attr]) {
                view = this.views[key];
              }
            }
          }
        }
      }
      if (view) {
        this.currentIndex = _.indexOf(this.views, view);
        this.triggerView({
          data: _.extend(view, {
            openOptions: options
          })
        });
      }
      return this;
    };

    Modal.prototype.next = function(options) {
      if (options == null) {
        options = {};
      }
      if (this.currentIndex + 1 < this.views.length) {
        return this.openAt(_.extend(options, {
          _index: this.currentIndex + 1
        }));
      }
    };

    Modal.prototype.previous = function(options) {
      if (options == null) {
        options = {};
      }
      if (this.currentIndex - 1 < this.views.length - 1) {
        return this.openAt(_.extend(options, {
          _index: this.currentIndex - 1
        }));
      }
    };

    return Modal;

  })(Backbone.View);

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone === "undefined" || Backbone === null) {
    throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js");
  }

  Backbone.Marionette.Modals = (function(_super) {
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
      Backbone.Marionette.triggerMethod.call(modal, "show");
      Backbone.Marionette.triggerMethod.call(this, "show", modal);
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
      Backbone.Marionette.triggerMethod.call(modal, "close");
      Backbone.Marionette.triggerMethod.call(this, "close", modal);
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

  })(Backbone.Marionette.Region);

}).call(this);
