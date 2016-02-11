define([
    'backbone',
    'mustache',
], function(Backbone, Mustache) {

    var MyProfileView = Backbone.View.extend({
    
        el: $('body'),

        events : {
            'click .fa-bars': 'toggleProfile'
        },

        toggleProfile: function() {
            console.log("step one");
        }

    });

    return MyProfileView;

});
