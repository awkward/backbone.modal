(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('Backbone.Marionette.Modals', function() {
    var modal, myLayout;
    myLayout = {};
    modal = {};
    beforeEach(function() {
      var layout;
      layout = (function(_super) {
        __extends(layout, _super);

        function layout() {
          return layout.__super__.constructor.apply(this, arguments);
        }

        layout.prototype.template = function() {
          return '<div id="modals"></div>';
        };

        layout.prototype.regions = {
          modals: {
            selector: '#modals',
            regionClass: Backbone.Marionette.Modals
          }
        };

        return layout;

      })(Backbone.Marionette.LayoutView);
      modal = (function(_super) {
        __extends(modal, _super);

        function modal() {
          return modal.__super__.constructor.apply(this, arguments);
        }

        modal.prototype.viewContainer = 'div';

        modal.prototype.cancelEl = '.destroy';

        modal.prototype.submitEl = '.submit';

        modal.prototype.template = function() {
          return '<a id="id"></a><div></div><a class="destroy"></a><a class="submit"></a>';
        };

        modal.prototype.views = {
          'click #id': {
            view: function() {
              return '<p>html</p>';
            }
          }
        };

        modal.prototype.cancel = function() {};

        modal.prototype.submit = function() {};

        return modal;

      })(Backbone.Modal);
      myLayout = new layout();
      return $('body').append(myLayout.render().el);
    });
    afterEach(function() {
      myLayout.destroy();
      myLayout = {};
      return modal = {};
    });
    describe('#show', function() {
      it('should stack a modal view', function() {
        myLayout.modals.show(new modal());
        return expect(myLayout.modals.zIndex).toBe(1);
      });
      return it('should disable modals with zIndex < modal', function() {
        var view;
        view = new modal();
        myLayout.modals.show(view);
        myLayout.modals.show(new modal());
        spyOn(view, 'delegateModalEvents');
        myLayout.modals.destroy();
        return expect(view.delegateModalEvents).toHaveBeenCalled();
      });
    });
    describe('#destroy', function() {
      return it('should only destroy the last modal', function() {
        myLayout.modals.show(new modal());
        myLayout.modals.destroy();
        return expect(myLayout.modals.zIndex).toBe(0);
      });
    });
    return describe('#destroyAll', function() {
      return it('should destroy all the modals', function() {
        myLayout.modals.show(new modal());
        myLayout.modals.destroyAll();
        return expect(myLayout.modals.zIndex).toBe(0);
      });
    });
  });

}).call(this);
