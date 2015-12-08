requirejs.config({

    baseUrl: "js/lib",

    paths: {
      "app": "../app",
      "text": "text",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
	    "materialize": "//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/js/materialize.min",
      "moments": "../helpers/moment",
      "mustache": "//cdnjs.cloudflare.com/ajax/libs/mustache.js/2.1.2/mustache",
      "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min",
      "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min",
      "stickit": "../helpers/backbone.stickit"
    },

    shim: {
       'underscore': {
          exports: '_'
      },
      'backbone': {
        //These script dependencies should be loaded before loading
        //backbone.js
        deps: ['underscore', 'jquery'],
        //Once loaded, use the global 'Backbone' as the
        //module value.
        exports: 'Backbone'
      }
    }

});

// Load the main app module to start the app
requirejs(["app/main"]);
