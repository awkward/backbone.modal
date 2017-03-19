// Require.JS config
require.config({
  baseUrl: '../../',
    paths: {
      jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.0/jquery.min',
      underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
      backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone',
      'backbone.radio': 'http://cdnjs.cloudflare.com/ajax/libs/backbone.radio/2.0.0/backbone.radio',
      'backbone.marionette': 'http://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/3.2.0/backbone.marionette'
    }
});

// Include backbone.modal and backbone.marionette.modals
require(['jquery', 'backbone.modal', 'backbone.radio', 'backbone.marionette.modals'], function($) {
  $(function() {

    // Create a layout class
    var Layout = Backbone.Marionette.View.extend({
      template: _.template($('#modals-template').html()),
      regions: {
        modals: {
          selector:   '.modals-container',
          regionClass: Backbone.Marionette.Modals
        }
      }
    });

    // Create a modal view class
    var Modal1 = Backbone.Modal.extend({
      template: _.template($('#modal-template1').html()),
      submitEl: '.bbm-button',
      events: {
        'click .open-2': 'openModal'
      },
      openModal: function(e) {
        e.preventDefault();
         modalsRegion.show(new Modal2());
      }
    });

    var Modal2 = Backbone.Modal.extend({
      template: _.template($('#modal-template2').html()),
      submitEl: '.bbm-button'
    });

    // Render the layout
    var myLayout = new Layout();
    var modalsRegion = myLayout.getRegion('modals');
    $('body').append(myLayout.render().el);

    // Render modals on click
    $('body').on('click', '.open-1', function(){
       modalsRegion.show(new Modal1());
    });

    $('.open-1').click()

  });
});
