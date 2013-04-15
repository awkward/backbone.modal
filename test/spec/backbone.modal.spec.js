(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('Backbone.Modal', function() {
    var modal;

    modal = {};
    beforeEach(function() {
      var backboneView, _ref, _ref1;

      backboneView = (function(_super) {
        __extends(backboneView, _super);

        function backboneView() {
          _ref = backboneView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        return backboneView;

      })(Backbone.View);
      return modal = (function(_super) {
        __extends(modal, _super);

        function modal() {
          _ref1 = modal.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        modal.prototype.viewContainer = 'div';

        modal.prototype.cancelEl = '';

        modal.prototype.submitEl = '';

        modal.prototype.template = function() {
          return '<a class="class"></a><a id="id"></a><div></div><a data-event="true"></a>';
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
        var key, match, selector, trigger, _results;

        view = new modal();
        view.render();
        _results = [];
        for (key in view.views) {
          match = key.match(/^(\S+)\s*(.*)$/);
          trigger = match[1];
          selector = match[2];
          _results.push(view.$(selector).trigger(trigger));
        }
        return _results;
      });
      it("#buildView: checks if it's a Backbone.View or just a HTML template that is passed along", function() {
        var key, v, _results;

        _results = [];
        for (key in view.views) {
          v = view.buildView(view.views[key].view);
          if (_.isFunction(v)) {
            _results.push(expect(_.isString(v.render().el)));
          } else {
            _results.push(expect(_.isString(v)));
          }
        }
        return _results;
      });
      return it("#length should return the length of the total views", function() {});
    });
    describe('#openAt', function() {
      return it('opens a view at the specified index', function() {
        var view;

        view = new modal();
        return expect(view.openAt(1)).toBe(view.views['click #id']);
      });
    });
    describe('#next', function() {});
    describe('#previous', function() {});
    describe('#currentIndex', function() {});
    describe('#render', function() {
      return it('renders the modal and internal views', function() {
        var view;

        view = new modal();
        return expect(_.isString(view.render().el));
      });
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
