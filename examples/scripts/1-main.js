// Require.JS config
require.config({
  baseUrl: '../../',
    paths: {
      jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.0/jquery.min',
      underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
      backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone'
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
