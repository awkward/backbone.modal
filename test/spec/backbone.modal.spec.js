(function() {
  describe('Backbone.Modal', function() {
    var view;

    view = {};
    beforeEach(function() {
      return view = new Backbone.Modal({
        template: function() {
          return '';
        },
        views: {
          view: function() {
            return '';
          }
        }
      });
    });
    afterEach(function() {
      return view = {};
    });
    it("should have Backbone defined", function() {
      return expect(Backbone).toBeDefined();
    });
    it('should throw an exception if there is no template or views present', function() {
      delete view.views;
      delete view.template;
      return expect(view.render).toThrow();
    });
    it('should throw an exception if a template is defined and no viewContainer is present', function() {});
    it('should throw an exception if no cancelEl is defined', function() {});
    it('should throw an exception if no submitEl is defined', function() {});
    describe('views:', function() {
      it('should throw an exception if no view is defined within views', function() {});
      it('checks for a showOn selector to open it', function() {});
      it('should be possible to pass an array with multiple events in it', function() {});
      it("checks if it's a Backbone.View or just a HTML template that is passed along", function() {});
      return describe('#open', function() {
        return it('opens a specific view', function() {});
      });
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
    describe('#submit', function() {});
    return describe('when the modal switches between a view', function() {
      return it('animates between views', function() {});
    });
  });

}).call(this);
