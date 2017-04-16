(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function(factory) {
    if (typeof define === "function" && define.amd) {
      return define(["underscore", "backbone", "exports"], factory);
    } else if (typeof exports === "object") {
      return factory(require("underscore"), require("backbone"), exports);
    } else {
      return factory(_, Backbone, {});
    }
  })(function(_, Backbone, Modal) {
    var focusableElements;
    focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '*[tabindex]', '*[contenteditable]'].join(', ');
    Modal = (function(superClass) {
      extend(Modal, superClass);

      Backbone.Modal = Modal;

      Modal.prototype.prefix = 'bbm';

      Modal.prototype.animate = true;

      Modal.prototype.keyControl = true;

      Modal.prototype.showViewOnRender = true;

      function Modal() {
        this.triggerCancel = bind(this.triggerCancel, this);
        this.triggerSubmit = bind(this.triggerSubmit, this);
        this.triggerView = bind(this.triggerView, this);
        this.clickOutsideElement = bind(this.clickOutsideElement, this);
        this.clickOutside = bind(this.clickOutside, this);
        this.checkKey = bind(this.checkKey, this);
        this.rendererCompleted = bind(this.rendererCompleted, this);
        this.args = Array.prototype.slice.apply(arguments);
        Backbone.View.prototype.constructor.apply(this, this.args);
        this.setUIElements();
      }

      Modal.prototype.render = function(options) {
        var $focusEl, data, ref;
        data = this.serializeData();
        if (!options || _.isEmpty(options)) {
          options = 0;
        }
        this.$el.addClass(this.prefix + "-wrapper");
        this.modalEl = Backbone.$('<div />').addClass(this.prefix + "-modal");
        if (this.template) {
          this.modalEl.html(this.buildTemplate(this.template, data));
        }
        this.$el.html(this.modalEl);
        if (this.viewContainer) {
          this.viewContainerEl = this.modalEl.find(this.viewContainer);
          this.viewContainerEl.addClass(this.prefix + "-modal__views");
        } else {
          this.viewContainerEl = this.modalEl;
        }
        $focusEl = Backbone.$(document.activeElement);
        if (!this.previousFocus) {
          this.previousFocus = $focusEl;
        }
        $focusEl.blur();
        if (((ref = this.views) != null ? ref.length : void 0) > 0 && this.showViewOnRender) {
          this.openAt(options);
        }
        if (typeof this.onRender === "function") {
          this.onRender();
        }
        if (this.active) {
          return true;
        }
        this.delegateModalEvents();
        if (this.$el.fadeIn && this.animate) {
          this.modalEl.css({
            opacity: 0
          });
          this.$el.fadeIn({
            duration: 100,
            complete: this.rendererCompleted
          });
        } else {
          this.rendererCompleted();
        }
        return this;
      };

      Modal.prototype.rendererCompleted = function() {
        var ref;
        if (this.keyControl) {
          Backbone.$('body').on('keyup.bbm', this.checkKey);
          this.$el.on('mouseup.bbm', this.clickOutsideElement);
          this.$el.on('click.bbm', this.clickOutside);
        }
        this.modalEl.css({
          opacity: 1
        }).addClass(this.prefix + "-modal--open");
        this.setInitialFocus();
        if (typeof this.onShow === "function") {
          this.onShow();
        }
        return (ref = this.currentView) != null ? typeof ref.onShow === "function" ? ref.onShow() : void 0 : void 0;
      };

      Modal.prototype.setInitialFocus = function() {
        if (this.autofocus) {
          return this.$(this.autofocus).focus();
        } else {
          return this.$('*').filter(focusableElements).filter(':visible').first().focus();
        }
      };

      Modal.prototype.setUIElements = function() {
        var ref;
        this.template = this.getOption('template');
        this.views = this.getOption('views');
        if ((ref = this.views) != null) {
          ref.length = _.size(this.views);
        }
        this.viewContainer = this.getOption('viewContainer');
        this.animate = this.getOption('animate');
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
        if (this.options && indexOf.call(this.options, option) >= 0 && (this.options[option] != null)) {
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
        var cancelEl, key, match, results, selector, submitEl, trigger;
        this.active = true;
        cancelEl = this.getOption('cancelEl');
        submitEl = this.getOption('submitEl');
        if (submitEl) {
          this.$el.on('click', submitEl, this.triggerSubmit);
        }
        if (cancelEl) {
          this.$el.on('click', cancelEl, this.triggerCancel);
        }
        results = [];
        for (key in this.views) {
          if (_.isString(key) && key !== 'length') {
            match = key.match(/^(\S+)\s*(.*)$/);
            trigger = match[1];
            selector = match[2];
            results.push(this.$el.on(trigger, selector, this.views[key], this.triggerView));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      Modal.prototype.undelegateModalEvents = function() {
        var cancelEl, key, match, results, selector, submitEl, trigger;
        this.active = false;
        cancelEl = this.getOption('cancelEl');
        submitEl = this.getOption('submitEl');
        if (submitEl) {
          this.$el.off('click', submitEl, this.triggerSubmit);
        }
        if (cancelEl) {
          this.$el.off('click', cancelEl, this.triggerCancel);
        }
        results = [];
        for (key in this.views) {
          if (_.isString(key) && key !== 'length') {
            match = key.match(/^(\S+)\s*(.*)$/);
            trigger = match[1];
            selector = match[2];
            results.push(this.$el.off(trigger, selector, this.views[key], this.triggerView));
          } else {
            results.push(void 0);
          }
        }
        return results;
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
        var ref;
        if (((ref = this.outsideElement) != null ? ref.hasClass(this.prefix + "-wrapper") : void 0) && this.active) {
          return this.triggerCancel();
        }
      };

      Modal.prototype.clickOutsideElement = function(e) {
        return this.outsideElement = Backbone.$(e.target);
      };

      Modal.prototype.buildTemplate = function(template, data) {
        var templateFunction;
        if (typeof template === 'function') {
          templateFunction = template;
        } else {
          templateFunction = _.template(Backbone.$(template).html());
        }
        return templateFunction(data);
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
        var base, base1, index, instance, key, options, ref;
        if (e != null) {
          if (typeof e.preventDefault === "function") {
            e.preventDefault();
          }
        }
        options = e.data;
        instance = this.buildView(options.view, options.viewOptions);
        if (this.currentView) {
          this.previousView = this.currentView;
          if (!((ref = options.openOptions) != null ? ref.skipSubmit : void 0)) {
            if ((typeof (base = this.previousView).beforeSubmit === "function" ? base.beforeSubmit(e) : void 0) === false) {
              return;
            }
            if (typeof (base1 = this.previousView).submit === "function") {
              base1.submit();
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
        var base, container, newHeight, previousHeight, ref, style, tester;
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
          if (typeof (base = this.currentView).onShow === "function") {
            base.onShow();
          }
          return (ref = this.previousView) != null ? typeof ref.destroy === "function" ? ref.destroy() : void 0 : void 0;
        } else {
          if (this.animate) {
            this.$(this.viewContainerEl).css({
              opacity: 0
            });
            return this.$(this.viewContainerEl).animate({
              height: newHeight
            }, 100, (function(_this) {
              return function() {
                var base1, ref1;
                _this.$(_this.viewContainerEl).css({
                  opacity: 1
                }).removeAttr('style');
                _this.$(_this.viewContainerEl).html(view);
                if (typeof (base1 = _this.currentView).onShow === "function") {
                  base1.onShow();
                }
                return (ref1 = _this.previousView) != null ? typeof ref1.destroy === "function" ? ref1.destroy() : void 0 : void 0;
              };
            })(this));
          } else {
            return this.$(this.viewContainerEl).css({
              height: newHeight
            }).html(view);
          }
        }
      };

      Modal.prototype.triggerSubmit = function(e) {
        var ref, ref1;
        if (e != null) {
          e.preventDefault();
        }
        if (Backbone.$(e != null ? e.target : void 0).is('textarea')) {
          return;
        }
        if (this.beforeSubmit) {
          if (this.beforeSubmit(e) === false) {
            return;
          }
        }
        if (this.currentView && this.currentView.beforeSubmit) {
          if (this.currentView.beforeSubmit(e) === false) {
            return;
          }
        }
        if (!this.submit && !((ref = this.currentView) != null ? ref.submit : void 0) && !this.getOption('submitEl')) {
          return this.triggerCancel();
        }
        if ((ref1 = this.currentView) != null) {
          if (typeof ref1.submit === "function") {
            ref1.submit();
          }
        }
        if (typeof this.submit === "function") {
          this.submit();
        }
        if (this.regionEnabled) {
          return this.trigger('modal:destroy');
        } else {
          return this.destroy();
        }
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
        if (this.regionEnabled) {
          return this.trigger('modal:destroy');
        } else {
          return this.destroy();
        }
      };

      Modal.prototype.destroy = function() {
        var removeViews;
        Backbone.$('body').off('keyup.bbm', this.checkKey);
        this.$el.off('mouseup.bbm', this.clickOutsideElement);
        this.$el.off('click.bbm', this.clickOutside);
        Backbone.$('tester').remove();
        if (typeof this.onDestroy === "function") {
          this.onDestroy();
        }
        this.shouldAnimate = false;
        this.modalEl.addClass(this.prefix + "-modal--destroy");
        removeViews = (function(_this) {
          return function() {
            var ref, ref1;
            if ((ref = _this.currentView) != null) {
              if (typeof ref.remove === "function") {
                ref.remove();
              }
            }
            _this.remove();
            return (ref1 = _this.previousFocus) != null ? typeof ref1.focus === "function" ? ref1.focus() : void 0 : void 0;
          };
        })(this);
        if (this.$el.fadeOut && this.animate) {
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
    Backbone.Modal = Modal;
    return Backbone.Modal;
  });

}).call(this);
