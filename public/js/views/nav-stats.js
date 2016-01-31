define([
    'backbone',
    'mustache',
    'countup'
], function(Backbone, Mustache, CountUp) {

    var NavStats = Backbone.View.extend({ 

        initialize: function() {
            this.render();
        },

        render: function() {
            this.renderFollowers();
            this.renderFollowing();
            this.renderPublicRepos();
        },

        renderFollowers: function() {
            var userFollowerCount = $('#userFollowerCount').attr("value");
            this.slowCount("userFollowerCount", userFollowerCount);
        },

        renderFollowing: function() {
            var userFollowingCount = $('#userFollowingCount').attr("value");
            this.slowCount("userFollowingCount", userFollowingCount);
        },

        renderPublicRepos: function() {
            var publicRepoCount = $('#publicRepoCount').attr("value");
            this.slowCount("publicRepoCount", publicRepoCount);
        },

        slowCount: function(elementName, value) {
            var options = {
                  useEasing : true, 
                  useGrouping : true, 
                  separator : ',', 
                  decimal : '.', 
                  prefix : '', 
                  suffix : '' 
            };
            var demo = new CountUp(elementName, 0, value, 0, 2.5, options);
            demo.start();
        }

    });

    return NavStats;

});
