// Require.JS config
require.config({
  baseUrl: '../../',
    paths: {
      jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
      underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore',
      backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone'
    }
});

// Include backbone.modal
require(['jquery', 'backbone.modal'], function($) {
  $(function() {
    
    // Create a modal view class
    var Modal = Backbone.Modal.extend({
      template: _.template($('#modal-template').html()),
      cancelEl: '.bbm-button'
    });

    $('.open').on('click', function(){

      // Render an instance of your modal
      var modalView = new Modal();
      $('.app').html(modalView.render().el);

    });

    $('.open').click()
  });
});
