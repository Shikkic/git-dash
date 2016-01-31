requirejs.config({

    baseUrl: "js/lib",

    paths: {
      "app": "../app",
      "text": "text",
      "jquery": "jquery-2.1.4.min",
	    "materialize": "materialize.min",
      "moments": "moment",
      "mustache": "mustache",
      "underscore": "underscore-min",
      "backbone": "backbone-min",
      "stickit": "backbone.stickit",
      "countup": "countUp.min"
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
