// Require.JS config
require.config({
  baseUrl: '../../',
    paths: {
      jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min',
      underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore',
      backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone',
      'backbone.marionette': 'http://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.1/backbone.marionette'
    }
});

// Include backbone.modal and backbone.marionette.modals
require(['jquery', 'backbone.modal', 'backbone.marionette.modals'], function($) {
  $(function() {

    // Create a layout class
    var Layout = Backbone.Marionette.LayoutView.extend({
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
         myLayout.modals.show(new Modal2());
      }
    });

    var Modal2 = Backbone.Modal.extend({
      template: _.template($('#modal-template2').html()),
      submitEl: '.bbm-button'
    });

    // Render the layout
    var myLayout = new Layout();
    $('body').append(myLayout.render().el);

    // Render modals on click
    $('body').on('click', '.open-1', function(){
       myLayout.modals.show(new Modal1());
    });

    $('.open-1').click()

  });
});
