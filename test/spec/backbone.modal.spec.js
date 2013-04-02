(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('Backbone.Modal', function() {
    var modal, view;

    view = {};
    modal = {};
    beforeEach(function() {
      var _ref;

      modal = (function(_super) {
        __extends(modal, _super);

        function modal() {
          _ref = modal.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        modal.prototype.viewContainer = '';

        modal.prototype.cancelEl = '';

        modal.prototype.submitEl = '';

        modal.prototype.template = function() {
          return '';
        };

        modal.prototype.views = {
          'click .class': {
            view: function() {
              return '';
            }
          },
          'click #id': {
            view: function() {
              return '';
            }
          }
        };

        return modal;

      })(Backbone.Modal);
      return view = new modal();
    });
    afterEach(function() {
      modal = {};
      return view = {};
    });
    it("should have Backbone defined", function() {
      return expect(Backbone).toBeDefined();
    });
    it('should throw an exception if there is no template or views present', function() {
      delete modal.prototype.views;
      delete modal.prototype.template;
      return expect(function() {
        return view.render();
      }).toThrow();
    });
    it('should throw an exception if a template and views are defined and no viewContainer is present', function() {
      delete modal.prototype.viewContainer;
      return expect(function() {
        return view.render();
      }).toThrow();
    });
    describe('views:', function() {
      it('binds the event to the selector to open a view', function() {});
      return it("checks if it's a Backbone.View or just a HTML template that is passed along", function() {});
    });
    describe('#openAt', function() {
      return it('opens a view at the specified index', function() {});
    });
    describe('#render', function() {
      return it('renders the modal and internal views', function() {});
    });
    describe('#beforeCancel', function() {
      it("calls this method when it's defined", function() {});
      return it('stops the cancel when it returns false', function() {});
    });
    describe('#cancel', function() {
      return it('calls cancel when cancelEl is triggered or ESC is pressed');
    });
    describe('#beforeSubmit', function() {});
    describe('#submit', function() {
      return it('calls submit when submitEl is triggered or ENTER is pressed');
    });
    return describe('when the modal switches between a view', function() {
      return it('animates between views', function() {});
    });
  });

}).call(this);
