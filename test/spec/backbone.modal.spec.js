(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('Backbone.Modal', function() {
    var modal;
    modal = {};
    beforeEach(function() {
      var backboneView;
      backboneView = (function(_super) {
        __extends(backboneView, _super);

        function backboneView() {
          return backboneView.__super__.constructor.apply(this, arguments);
        }

        return backboneView;

      })(Backbone.View);
      return modal = (function(_super) {
        __extends(modal, _super);

        function modal() {
          return modal.__super__.constructor.apply(this, arguments);
        }

        modal.prototype.viewContainer = 'div';

        modal.prototype.cancelEl = '.destroy';

        modal.prototype.submitEl = '.submit';

        modal.prototype.template = function() {
          return '<a class="class"></a><a id="id"></a><div></div><a data-event="true"></a><a class="destroy"></a><a class="submit"></a>';
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
      return it('renders the modal and internal views', function() {
        var view;
        view = new modal();
        return expect(view.render().el instanceof HTMLElement).toBeTruthy();
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
