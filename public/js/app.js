requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app",
      "text": "text",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
	  "materialize": "//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/js/materialize.min",
      "moments": "../helpers/moment",
      "mustache": "//cdnjs.cloudflare.com/ajax/libs/mustache.js/2.1.2/mustache",
      "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min",

    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
