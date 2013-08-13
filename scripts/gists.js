$.fn.gistify = function() {
  return this.find('code[data-gist]').each(function() {
    var _this = this;
    return $.ajax({
      url: $(this).data('gist'),
      dataType: 'jsonp',
      success: function(response) {
        return $(_this).html(response.div);
      }
    });
  });
};
