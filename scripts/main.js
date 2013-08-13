$(function() {
	$('body').gistify();

  // create a layout class
  var Layout = Backbone.Marionette.Layout.extend({
    template: _.template($('#modals-template').html()),
    regions: {
      modals: {
        selector:   '.modals-container',
        regionType: Backbone.Marionette.Modals
      }  
    }
  });

  // create a modal view class
  var Modal1 = Backbone.Modal.extend({
    template: _.template($('#modal-template1').html()),
    viewContainer: '.my-container',
    submitEl: '.bb-modal-button',
    views: {
      'click #tab1': {
        name: 'tab1',
        view: _.template($('#modal-tab1').html()),
        onActive: 'setActive'
      },
      'click #tab2': {
        name: 'tab2',
        view: _.template($('#modal-tab2').html()),
        onActive: 'setActive'
      },
      'click #tab3': {
        name: 'tab3',
        view: _.template($('#modal-tab3').html()),
        onActive: 'setActive'
      }
    },

    beforeCancel: function() {
    	return false;
    },
    
    setActive: function(options) {
      this.$('.tabbar-tab a').removeClass('active');
      this.$('#'+options.name).addClass('active');
    },
    onClose: function() {
      console.log('onClose');
    }
  });

  var Modal2 = Backbone.Modal.extend({
    template: _.template($('#modal-template2').html()),
    submitEl: '.bb-modal-button'
  });

  var myLayout = new Layout();
  $('.app').append(myLayout.render().el);

  myLayout.modals.show(new Modal1());

  $('.app').on('click', '.open-2', function(){
    myLayout.modals.show(new Modal2());
  });

});