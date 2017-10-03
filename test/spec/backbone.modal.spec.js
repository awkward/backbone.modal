(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  describe('Backbone.Modal', function() {
    var modal;
    modal = {};
    beforeEach(function() {
      var backboneView;
      backboneView = (function(superClass) {
        extend(backboneView, superClass);

        function backboneView() {
          return backboneView.__super__.constructor.apply(this, arguments);
        }

        return backboneView;

      })(Backbone.View);
      return modal = (function(superClass) {
        extend(modal, superClass);

        function modal() {
          return modal.__super__.constructor.apply(this, arguments);
        }

        modal.prototype.viewContainer = 'div';

        modal.prototype.cancelEl = '.destroy';

        modal.prototype.submitEl = '.submit';

        modal.prototype.template = function() {
          return '<a href="#" class="class">link</a><a href="#" id="id"></a><div></div><a data-event="true"></a><a class="destroy"></a><a class="submit"></a>';
        };

        modal.prototype.views = {
          'click .class': {
            view: new backboneView
          },
          'click #id': {
            view: function() {
              return '<p>html</p>';
            }
          },
          'click [data-event]': {
            view: function() {
              return new Backbone.View({
                option: true
              });
            }
          }
        };

        modal.prototype._shouldCancel = true;

        modal.prototype._shouldSubmit = true;

        modal.prototype.beforeCancel = function() {
          return this._shouldCancel;
        };

        modal.prototype.beforeSubmit = function() {
          return this._shouldSubmit;
        };

        modal.prototype.cancel = function() {};

        modal.prototype.submit = function() {};

        return modal;

      })(Backbone.Modal);
    });
    afterEach(function() {
      return modal = {};
    });
    it("should have Backbone defined", function() {
      return expect(Backbone).toBeDefined();
    });
    it('should throw an exception if there is no template or views present', function() {
      delete modal.prototype.views;
      delete modal.prototype.template;
      return expect(function() {
        return new modal();
      }).toThrow();
    });
    it('should throw an exception if a template and views are defined and no viewContainer is present', function() {
      delete modal.prototype.viewContainer;
      return expect(function() {
        return new modal;
      }).toThrow();
    });
    describe('views:', function() {
      var view;
      view = {};
      beforeEach(function() {
        return view = new modal();
      });
      it('should trigger the first view when rendered', function() {
        spyOn(view, 'triggerView');
        view.render();
        return expect(view.triggerView).toHaveBeenCalled();
      });
      return it("#length should return the length of the total views", function() {
        return expect(view.views.length).toEqual(3);
      });
    });
    describe('#destroy', function() {
      return it('should restore focus to previously focused element', function() {
        var $prevFocus, view;
        $prevFocus = Backbone.$('<button id="prev-focus">');
        Backbone.$('body').append($prevFocus);
        Backbone.$('#prev-focus').focus();
        view = new modal();
        view.animate = false;
        view.render();
        view.destroy();
        expect(document.activeElement.id).toEqual('prev-focus');
        return Backbone.$('#prev-focus').remove();
      });
    });
    describe('#openAt', function() {
      return it('opens a view at the specified index', function() {
        var view;
        view = new modal();
        view.openAt(1);
        return expect(view.currentIndex).toBe(1);
      });
    });
    describe('#next', function() {
      return it('should open the next view', function() {
        var view;
        view = new modal();
        view.render().next();
        return expect(view.currentIndex).toBe(1);
      });
    });
    describe('#previous', function() {
      return it('should open the previous view', function() {
        var view;
        view = new modal();
        view.render().openAt(2).previous();
        return expect(view.currentIndex).toBe(1);
      });
    });
    describe('#currentIndex', function() {
      return it('should return the index of the current view', function() {
        var view;
        view = new modal();
        view.render().openAt(2);
        return expect(view.currentIndex).toBe(2);
      });
    });
    describe('#render', function() {
      var view;
      view = {};
      it('renders the modal and internal views', function() {
        view = new modal();
        return expect(view.render().el instanceof HTMLElement).toBeTruthy();
      });
      return it('should set initial focus', function() {
        view = new modal();
        spyOn(view, 'setInitialFocus');
        view.animate = false;
        view.render();
        return expect(view.setInitialFocus).toHaveBeenCalled();
      });
    });
    describe('#setInitialFocus', function() {
      it('should set focus to first focusable element', function() {
        var view;
        view = new modal();
        view.animate = false;
        Backbone.$('body').append(view.render().el);
        view.setInitialFocus();
        expect(document.activeElement).toBe(document.querySelector('.class'));
        return view.destroy();
      });
      it('should be overridable with autofocus option', function() {
        var view;
        view = new modal();
        view.autofocus = '#id';
        view.animate = false;
        Backbone.$('body').append(view.render().el);
        view.setInitialFocus();
        expect(document.activeElement).toBe(document.querySelector('#id'));
        return view.destroy();
      });
      it('should save a reference to the previously focused element', function() {
        var expected, view;
        expected = Backbone.$(document.activeElement);
        view = new modal();
        view.render();
        return expect(view.previousFocus).toEqual(expected);
      });
      return it('should re-renders without animation or event delegation when called again', function() {
        var returned, view;
        view = new modal();
        returned = view.render();
        spyOn(view, 'delegateModalEvents');
        spyOn(view, 'rendererCompleted');
        expect(returned).toBe(view);
        returned = view.render();
        expect(view.delegateModalEvents).not.toHaveBeenCalled();
        expect(view.rendererCompleted).not.toHaveBeenCalled();
        return expect(returned).toBe(view);
      });
    });
    describe('#beforeCancel', function() {
      it("should call this method when it's defined", function() {
        var view;
        view = new modal();
        spyOn(view, 'beforeCancel');
        view.render().triggerCancel();
        return expect(view.beforeCancel).toHaveBeenCalled();
      });
      return it('stops the cancel when it returns false', function() {
        var view;
        view = new modal();
        spyOn(view, 'destroy');
        view._shouldCancel = false;
        view.render().triggerCancel();
        return expect(view.destroy).not.toHaveBeenCalled();
      });
    });
    describe('#cancel', function() {
      return it('should be called when cancelEl is triggered', function() {
        var view;
        view = new modal();
        spyOn(view, 'cancel');
        view.render().$(view.cancelEl).click();
        return expect(view.cancel).toHaveBeenCalled();
      });
    });
    describe('#triggerSubmit', function() {
      return it('should not throw when called without an event', function() {
        var view;
        view = new modal();
        view.render();
        return expect(view.triggerSubmit).not.toThrow();
      });
    });
    describe('#beforeSubmit', function() {
      it("should call this method when it's defined", function() {
        var view;
        view = new modal();
        spyOn(view, 'beforeSubmit');
        view.render().triggerSubmit({
          preventDefault: function() {}
        });
        return expect(view.beforeSubmit).toHaveBeenCalled();
      });
      return it('stops the submit when it returns false', function() {
        var view;
        view = new modal();
        spyOn(view, 'submit');
        view._shouldSubmit = false;
        view.render().triggerSubmit({
          preventDefault: function() {}
        });
        return expect(view.submit).not.toHaveBeenCalled();
      });
    });
    describe('#submit', function() {
      return it('should be called when submitEl is triggered', function() {
        var view;
        view = new modal();
        spyOn(view, 'submit');
        view.render().$(view.submitEl).click();
        return expect(view.submit).toHaveBeenCalled();
      });
    });
    return describe('#clickOutside', function() {
      return it('should not throw when outsideElement is undefined', function() {
        var view;
        view = new modal();
        return expect(view.clickOutside).not.toThrow();
      });
    });
  });

}).call(this);
