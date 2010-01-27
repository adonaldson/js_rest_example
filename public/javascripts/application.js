// Namespace function
function namespace(ns) {
  ns = ns.split('.');
  var cur = window, i;
  while ( i = ns.shift() ) {
    if ( !cur[i] ) cur[i] = {};
    cur = cur[i];
  }
}

namespace("Helper");

Helper.destroy_post_click = function(source) {
  var _this = $(source);
  var id = Model.extract_id(_this.parents('tr:first').attr('id'));
  var post = new Post();
  post.find(id);

  if (confirm('Delete post "' + post.data.title + '"?')) {
    post.destroy();
  }
};

$(document).ready(function() {
  if ($("#index").length == 0)
    return;

  // Load in the 'new' form, and listen for submissions
  $("#new_post_form_container").load('/posts/new form');

  jQuery.listen('click', '#post_submit', function(e) {
    var post = new Post();
    post.data.title = $("#post_title").val();
    post.data.body = $("#post_body").val();
    post.data.published = $("#post_published:checked").length == 0 ? 0 : $("#post_published").val();
    post.save();

    e.preventDefault();
  });

  $("table#posts").click(function(e) {
    var target = $(e.target);
    
    if (target.hasClass('destroy_post')) {
      Helper.destroy_post_click(target);
    }

    e.preventDefault();
  });

  

  // Listener for destroy post link
  jQuery.listen('click', '.destroy_post', function(e) {

  });

  // Replaced title text with an editable field, listen for changes
  $("td.title").each(function() {
    var _this = $(this);
    var edit_field = $('<input type="text" value="" class="edit_title_field" />');
    edit_field.val(_this.text());
    _this.html(edit_field);
  });

  jQuery.listen('blur', '.edit_title_field', function(e) {
    var _this = $(this);
    var id = Model.extract_id($(this).parents('tr:first').attr('id'));
    var post = new Post
    post.find(id);

    if (post.data.title != _this.val()) {
      var old_value = post.data.title;

      _this.addClass('saving');
      
      post.data.title = _this.val();
      post.save();
      }
  });
  
  // Callbacks

  View.Callback.after_post_save.push(function(post) {
    if (post.new_record) {
      // Copy the first row and update it -- theres probably a better way to do this
      var new_row = $("tr.post:first").clone(); 
      new_row.attr('id', 'post_' + post.id);
      new_row.find("a").each(function() {
        var _this = $(this);
        _this.attr("href", _this.attr("href").replace(/\/(\d+)/, '/' + post.id))
      });
      new_row.appendTo("table#posts");
    }

    post.update();
  });

  View.Callback.after_post_update.push(function(post) {
    var markup = $("#post_" + post.id);
    var edit_title_field = markup.find('input.edit_title_field:first');
    var published_field = markup.find('td.published');

    published_field.html(post.data.published.toString());
    edit_title_field.val(post.data.title);
    edit_title_field.removeClass('saving').removeClass('error');
  });

  View.Callback.after_post_error.push(function(post) {
    var markup = $("#post_" + post.id);
    markup.find('input').removeClass('saving').addClass('error');

    for (var ii=0; ii< post.errors.length; ii++) {
      $("body").append("<p>" + post.errors[ii][0] + " " + post.errors[ii][1] + "</p>");
    }
  });
  
  // On successful destroy, remove the row
  View.Callback.after_post_destroy.push(function(post) {
    var markup = $("#post_" + post.id);
    markup.slideUp(function() {
      $(this).remove();
    });
  });

  // Update counter (ajax)
  View.Callback.after_post_destroy.push(function(post) {
    update_counter_with_ajax();
  });

  View.Callback.after_post_update.push(function(post) {
    update_counter_with_ajax();
  });
});

var update_counter_with_ajax = function() {
  $('#post_count_using_ajax').load('/posts/count');
};
