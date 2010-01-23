var Model = Class.extend({
  config: {
    name: 'post',
    rest: {
      path: 'posts'
    }
  },

  init: function() {
    this.data_source = Data[this.config.name];
    this.data = {};
    this.ignored_fields = ['id', 'updated_at', 'created_at'];
  },
  find: function(id) {
    this.id = id;
    this.data = this.data_source[id];
  },
  to_params: function() {
    var params = {};
    
    for (var key_name in this.data) {
      if (this.ignored_fields.indexOf(key_name) > -1)
        continue;

      params[this.config.name + '[' + key_name + ']'] = this.data[key_name];      
    };

    return params;
  },
  after_update: function() {
    View.Callback.invoke_callback('after_' + this.config.name + '_update', this);
    View.Callback.invoke_callback('after_update', this);
  },
  after_save: function() {
    if (this.id == undefined) {
      this.new_record = true
      this.data_source[this.data.id] = this.data;
      this.find(this.data.id)
    }

    View.Callback.invoke_callback('after_' + this.config.name + '_save', this);
    View.Callback.invoke_callback('after_save', this);
  },
  after_destroy: function() {
    View.Callback.invoke_callback('after_' + this.config.name + '_destroy', this);
    View.Callback.invoke_callback('after_destroy', this);
  },
  after_error: function(errors) {
    this.errors = errors;
    View.Callback.invoke_callback('after_' + this.config.name + '_error', this);
    View.Callback.invoke_callback('after_error', this);
  },
  update: function() {
    this.after_update();
  },
  save: function() {
    var _this = this;

    var params = this.to_params();
    params['format'] = 'js';

    if (_this.id == undefined) {
      save_url = '/' + _this.config.rest.path + '/';
    } else {
      params['_method'] = 'put';
      save_url = '/' + _this.config.rest.path + '/' + _this.id;
    }

    $.ajax({
      type: 'POST',
      url: save_url,
      data: params,
      success: function(response_data) {
        if (_this.id == undefined)
          _this.data = JSON.parse(response_data);

        _this.after_save();
      },
      error: function(response_data) {
        var errors = JSON.parse(response_data.responseText);
        _this.after_error(errors);
      }
    });
  },
  destroy: function() {
    var _this = this;
    var params = {
      format: 'js',
      _method: 'delete'
      };

    $.ajax({
      type: 'POST',
      url: '/' + _this.config.rest.path + '/' + _this.id,
      data: params,
      success: function(response_data) {
        _this.after_destroy();
      },
      error: function(response_data) {
        // Do su'in
      }
    });
  }
});

Model.register_callback = function(callback_name) {
  if (typeof(View.Callback[callback_name]) == 'undefined')
    View.Callback[callback_name] = [];
};

Model.register_default_callbacks = function(model_name) {
  Model.register_callback('after_' + model_name + '_update');
  Model.register_callback('after_' + model_name + '_save');
  Model.register_callback('after_' + model_name + '_destroy');
  Model.register_callback('after_' + model_name + '_error');
};

Model.extract_id = function(str) {
  if (str == undefined)
    return -1;
  
  var result = str.match(/_(\d+)$/);
  
  if ((result) && (result.length > 1)) {
    return parseInt(result[1], 10);
  } else {
    return -1;
  }
};

Model.new_model_type = function(options) {
  Model.register_default_callbacks(options.config.name);
  return Model.extend(options);
};

