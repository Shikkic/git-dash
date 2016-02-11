define([
    "jquery",
    "moments",
    "mustache",
    "underscore",
    "backbone",
    "../../../js/collections/profile-collection",
    "../../../js/collection-views/profile-collection-view",
    "../../../js/views/nav-stats",
    "../../../js/views/my-profile-view"
], function($, Moments, Mustache, _, Backbone, ProfileCollection, ProfileCollectionView, NavStatsView, MyProfileView) {

        var PageView = Backbone.View.extend({

            initialize: function(options) {
                console.log("Creating Collection View");
                this.navStatsView = new NavStatsView({});
                this.myProfile = new MyProfileView({});
                this.profileCollectionView = new ProfileCollectionView({});
            }

        });

        // Instantiate our Page View
        var pageView = new PageView({el: $('body')});
});
