define([
    "jquery",
    "moments",
    "mustache",
    "underscore",
    "backbone",
    "../../../js/collections/profile-collection",
    "../../../js/collection-views/profile-collection-view"
], function($, Moments, Mustache, _, Backbone, ProfileCollection, ProfileCollectionView) {

        var PageView = Backbone.View.extend({

            initialize: function(options) {
                console.log("Creating Collection View");
                this.profileCollectionView = new ProfileCollectionView({});
            }

        });

        // Instantiate our Page View
        var pageView = new PageView({el: $('body')});
});
