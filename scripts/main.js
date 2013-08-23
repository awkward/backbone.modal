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

  var InfoModal = Backbone.Modal.extend({
    template: _.template($('#info-modal-template').html()),
    cancelEl: '.bbm-button',
    events: {
      'click .open-tab': 'openTab',
      'click .open-wizard': 'openWizard'
    },
    openTab: function(e) {
      e.preventDefault();
      myLayout.modals.show(new TabModal());
    },
    openWizard: function(e) {
      e.preventDefault();
      myLayout.modals.show(new WizardModal());
    }
  });

  var TabModal = Backbone.Modal.extend({
    template: _.template($('#tab-modal-template').html()),

    viewContainer: '.my-container',
    submitEl: '.bbm-button',

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

    setActive: function(options) {
      this.$('.bbm-modal__tab a').removeClass('active');
      this.$('#'+options.name).addClass('active');
    }
  });


  var WizardModal = Backbone.Modal.extend({
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

  myLayout.modals.show(new InfoModal());
});