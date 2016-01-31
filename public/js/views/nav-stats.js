define([
    'backbone',
    'mustache',
    'countup',
    '../models/nav-stats'
], function(Backbone, Mustache, CountUp, NavStatsModel) {

    var NavStatsView = Backbone.View.extend({ 

        initialize: function() {
            this.model = new NavStatsModel({});
    
            this.listenTo(this.model, 'change', this.render);
            
            this.model.fetch();
        },

        render: function() {
            console.log("MADE IT TO RENDER", this.model);
            this.renderTotalContributrions();
            this.renderLongestStreak();
            this.renderCurrentStreak();
        },

        renderTotalContributrions: function() {
            this.slowCount("userFollowerCount", this.model.get('totalContributions'));
        },

        renderLongestStreak: function() {
            this.slowCount("userFollowingCount", this.model.get('longestStreak'));
        },

        renderCurrentStreak: function() {
            this.slowCount("publicRepoCount", this.model.get('currentStreak'));
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

    return NavStatsView;

});
