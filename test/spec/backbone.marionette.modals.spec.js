(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  describe('Backbone.Marionette.Modals', function() {
    var modal, modalsRegion, myLayout;
    myLayout = {};
    modal = {};
    modalsRegion = {};
    beforeEach(function() {
      var layout;
      layout = (function(superClass) {
        extend(layout, superClass);

        function layout() {
          return layout.__super__.constructor.apply(this, arguments);
        }

        layout.prototype.template = function() {
          return '<div id="modals"></div>';
        };

        layout.prototype.regions = {
          modals: {
            el: '#modals',
            regionClass: Backbone.Marionette.Modals
          }
        };

        return layout;

      })(Backbone.Marionette.View);
      modal = (function(superClass) {
        extend(modal, superClass);

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
      modalsRegion = myLayout.getRegion('modals');
      return $('body').append(myLayout.render().el);
    });
    afterEach(function() {
      myLayout.destroy();
      myLayout = {};
      modal = {};
      return modalsRegion = {};
    });
    describe('#show', function() {
      it('should stack a modal view', function() {
        modalsRegion.show(new modal());
        return expect(modalsRegion.zIndex).toBe(1);
      });
      return it('should disable modals with zIndex < modal', function() {
        var view;
        view = new modal();
        modalsRegion.show(view);
        modalsRegion.show(new modal());
        spyOn(view, 'delegateModalEvents');
        modalsRegion.destroy();
        return expect(view.delegateModalEvents).toHaveBeenCalled();
      });
    });
    describe('#destroy', function() {
      return it('should only destroy the last modal', function() {
        modalsRegion.show(new modal());
        modalsRegion.destroy();
        return expect(modalsRegion.zIndex).toBe(0);
      });
    });
    return describe('#destroyAll', function() {
      return it('should destroy all the modals', function() {
        modalsRegion.show(new modal());
        modalsRegion.destroyAll();
        return expect(modalsRegion.zIndex).toBe(0);
      });
    });
  });

}).call(this);
