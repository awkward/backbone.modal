(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('Backbone.Marionette.Modals', function() {
    var layout, modal, myLayout, _ref, _ref1;
    myLayout = {};
    layout = (function(_super) {
      __extends(layout, _super);

      function layout() {
        _ref = layout.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      layout.prototype.template = function() {
        return '<div id="modals"></div>';
      };

      layout.prototype.regions = {
        modals: {
          selector: '#modals',
          regionType: Backbone.Marionette.Modals
        }
      };

      return layout;

    })(Backbone.Marionette.Layout);
    modal = (function(_super) {
      __extends(modal, _super);

      function modal() {
        _ref1 = modal.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      modal.prototype.viewContainer = 'div';

      modal.prototype.cancelEl = '.close';

      modal.prototype.submitEl = '.submit';

      modal.prototype.template = function() {
        return '<a id="id"></a><div></div><a class="close"></a><a class="submit"></a>';
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
    describe('#show', function() {
      it('should stack a modal view', function() {
        myLayout.modals.show(new modal());
        return expect(myLayout.modals.zIndex).toBe(1);
      });
      return it('should disable modals with zIndex < modal', function() {});
    });
    describe('#close', function() {
      it('should only close the last modal', function() {
        myLayout.modals.close();
        return expect(myLayout.modals.zIndex).toBe(0);
      });
      return it('should enable the last modal', function() {});
    });
    return describe('#closeAll', function() {
      return it('should close all the modals', function() {
        myLayout.modals.show(new modal());
        myLayout.modals.closeAll();
        return expect(myLayout.modals.modals.length).toBe(0);
      });
    });
  });

}).call(this);
