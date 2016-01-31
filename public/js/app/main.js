define([
    "jquery",
    "moments",
    "mustache",
    "underscore",
    "backbone",
    "../../../js/collections/profile-collection",
    "../../../js/collection-views/profile-collection-view",
    "../../../js/views/nav-stats"
], function($, Moments, Mustache, _, Backbone, ProfileCollection, ProfileCollectionView, Navstats) {

        var PageView = Backbone.View.extend({

            initialize: function(options) {
                console.log("Creating Collection View");
                this.navstats = new Navstats();

                this.profileCollectionView = new ProfileCollectionView({});
            }

        });

        // Instantiate our Page View
        var pageView = new PageView({el: $('body')});
});
