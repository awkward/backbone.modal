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
    beforeCancel: function() {
      this.openAgain()
    },
    beforeSubmit: function() {
      this.openAgain()
    },
    openAgain: function() {
      _.delay(function() {
        myLayout.modals.show(new InfoModal());
      }, 500);
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
    template: _.template($('#wizard-modal-template').html()),
    viewContainer: '.my-container',
    submitEl: '.done',
    cancelEl: '.cancel',
    views: {
      'click #step1': {
        view: _.template($('#modal-step1-template').html()),
        onActive: 'checkStep'
      },
      'click #step2': {
        view: _.template($('#modal-step2-template').html()),
        onActive: 'checkStep'
      },
      'click #step3': {
        view: _.template($('#modal-step3-template').html()),
        onActive: 'checkStep'
      }
    },
    events: {
      'click .previous': 'previousStep',
      'click .next': 'nextStep'
    },
    checkStep: function(options) {
      this.$('.next').removeClass('done inactive').text('Next');
      this.$('.previous').removeClass('inactive');

      if(this.currentIndex == 0) {
        this.$('.previous').addClass('inactive');
      } else if(this.currentIndex == this.views.length-1) {
        this.$('.next').addClass('done').text('Close');
      }
    },
    previousStep: function(e) {
      e.preventDefault();
      this.previous();
    },
    nextStep: function(e) {
      e.preventDefault();
      this.next();
    },
    beforeSubmit: function() {
      if(this.currentIndex != this.views.length-1) {
        this.next();
        return false;
      }
      return true;
    }
  });

  var myLayout = new Layout();
  $('.app').append(myLayout.render().el);

  myLayout.modals.show(new InfoModal());
});