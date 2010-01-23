var View = function() {};

View.Callback = {
  invoke_callback: function(callback_type, model) {
    var callbacks = View.Callback[callback_type];
 
    for (var ii=0; ii<callbacks.length; ii++) {
      callbacks[ii](model);
    }
  },
  after_update: [],
  after_save: [],
  after_destroy: [],
  after_error: []
};
