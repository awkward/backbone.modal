$(function() {
	$('body').gistify();

  var Layout = Backbone.Marionette.Layout.extend({
    template: _.template($('#modals-template').html()),
    regions: {
      modals: {
        selector:   '.modals-container',
        regionType: Backbone.Marionette.Modals
      }  
    }
  });

  var TabModal = Backbone.Modal.extend({
    template: _.template($('#modal-template').html()),

    viewContainer: '.my-container',

    events: {
      'click .open-info': 'openInfo'
    },

    views: {
      'click #tab1': {
        name: 'tab1',
        view: _.template($('#modal-view1-template').html()),
        onActive: 'setActive'
      },
      'click #tab2': {
        name: 'tab2',
        view: _.template($('#modal-view2-template').html()),
        onActive: 'setActive'
      }
    },
    beforeCancel: function() {
      return false;
    },
    beforeSubmit: function() {
      return false;
    },
    openInfo: function(e) {
      e.preventDefault()
      myLayout.modals.show(new InfoModal());
    },
    setActive: function(options) {
      this.$('.tabbar-tab a').removeClass('active');
      this.$('#'+options.name).addClass('active');
    }
  });

  var InfoModal = Backbone.Modal.extend({
    template: _.template($('#modal-template1').html()),
    cancelEl: '.bb-modal-button',
    events: {
      'click .open-tour': 'openTour'
    },
    openTour: function(e) {
      e.preventDefault()
      myLayout.modals.show(new TourModal());
    }
  });

  var TourModal = Backbone.Modal.extend({
    submitEl: '.done',
    cancelEl: '.cancel',

    views: {
      'click #step1': {
        view: _.template($('#modal-step1-template').html())
      },
      'click #step2': {
        view: _.template($('#modal-step2-template').html())
      },
      'click #step3': {
        view: _.template($('#modal-step3-template').html())
      }
    },

    events: {
      'click .previous': 'previousStep',
      'click .next': 'nextStep'
    },

    previousStep: function(e) {
      e.preventDefault();
      this.previous();
    },

    nextStep: function(e) {
      e.preventDefault();
      this.next();
    }

  });

  var myLayout = new Layout();
  $('.app').append(myLayout.render().el);

  myLayout.modals.show(new TabModal());
});