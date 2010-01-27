var Post = Model.new_model_type({
  config: {
    name: 'post',
    rest: { path: 'posts' }
  },

  say_hello: function(item) {
    return "hello, " + item + ", from " + this.config.name;
  }
});
