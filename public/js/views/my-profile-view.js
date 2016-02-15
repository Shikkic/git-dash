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
            if ($('#my-profile').hasClass('show-my-profile')) {
                this.hideProfile();
            } else {
                this.showProfile();
            }
        },

        showProfile: function() {
            $('#my-profile').removeClass("hide-my-profile");
            $('#container').removeClass('hide-profile');
            $('#container').addClass('show-profile');
            $('#my-profile').addClass("show-my-profile");
        },

        hideProfile: function() {
            $('#my-profile').removeClass("show-my-profile");
            $('#container').removeClass('show-profile');
            $('#my-profile').addClass('hide-my-profile');
            $('#container').addClass('hide-profile');
        }

    });

    return MyProfileView;

});
