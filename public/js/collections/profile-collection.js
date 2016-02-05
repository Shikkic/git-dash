define([
    'backbone',
    'moments',
    '../models/gitcard.js'
], function(Backbone, Moments, GitCardModel) {

	var ProfileCollection = Backbone.Collection.extend({

        model: GitCardModel,

        url: '/geet',

        initialize: function(options) {
            _.bindAll(this, 'parse', 'fetch');
        },
            
	    comparator: function(model) {
	        var date = new Date(model.get('dateString'));
	        return -date;
	    },

        parse: function(response) {
            // TODO REFACTOR THIS
            var modelDataArray = [];
            var data = response;
            for(var i = 0; i < response.length; i++) {
                var userData = response[i];

                gitCardModelData = {};
                if (userData) {
                    if (userData && userData.eventData && userData.eventData.pushEvents ) {
                        // Throwing error since some commits didn't have specifc data
                        if (userData.eventData.pushEvents.payload.commits[0]) {
                            var commit = userData.eventData.pushEvents.payload.commits.length ? userData.eventData.pushEvents.payload.commits[0].message : " ";
                            var commitMsg = userData.eventData.pushEvents.payload.commits.length ? userData.eventData.pushEvents.payload.commits[0].sha.slice(0 ,5) : "";
                            var commitSha = userData.eventData.pushEvents.payload.commits[0].sha.slice(0,5);
                            var commitUrl ='http://github.com/'+userData.eventData.pushEvents.repo.name+'/commit/'+userData.eventData.pushEvents.payload.commits[0].sha;
                            var repoName = userData.eventData.pushEvents.repo.name;
                            var date = "Last pushed "+ Moments(userData.eventData.pushEvents.created_at).fromNow();
                            var dateString = userData.eventData.pushEvents.created_at;
                        } else {
                            var commit = "N/A";
                            var commitMsg = "No recent commits";
                            var commitSha = "N/A";
                            var commitUrl = "N/A";
                            var repoName = "N/A";
                            var data = "N/A";
                            var dateString = "2015-01-31T23:04:09Z";
                        }
                    } else {
                        var commit = "N/A";
                        var commitMsg = "No recent commits";
                        var commitSha = "";
                        var commitUrl = "N/A";
                        var repoName = "No recent commits";
                        var data = "N/A";
                        var dateString = "2015-01-31T23:04:09Z";
                    }


                    gitCardModelData = {
                        repoName: repoName,
                        commitMsg: commit,
                        commitSha, commitSha,
                        commitUrl: commitUrl,
                        date: date, 
                        dateString: dateString
                    };
                            

                    if (userData && userData.eventData && userData.eventData.watchEvents) {
                        // If a user has watched events (stars) set them
                        gitCardModelData.watch = userData.eventData.watchEvents.repo.name;
                        gitCardModelData.watchUrl = 'http://www.github.com/'+userData.eventData.watchEvents.repo.name; 
                    } else {
                        gitCardModelData.watch = "N/A";
                        gitCardModelData.watchUrl = "N/A";
                    }

                    if (userData.contributions) {
                            gitCardModelData.currentStreak = userData.contributions.currentStreaks;
                            gitCardModelData.longestStreak = userData.contributions.longestStreaks;
                            gitCardModelData.totalContributions = userData.contributions.totals;
                    } if (userData.personalData) {
                            var personalData = userData.personalData.personalData;
                            gitCardModelData.company = userData.personalData.personalData.company;
                            gitCardModelData.location = userData.personalData.personalData.location;
                            //TODO add these to the view
                            gitCardModelData.blog = userData.personalData.personalData.blog;
                            gitCardModelData.imgUrl = personalData.avatar_url;
                            gitCardModelData.user = personalData.name ? personalData.name : personalData.login;
                            gitCardModelData.userID = personalData.login.toLowerCase();
                    }
                    modelDataArray.push(gitCardModelData);
                }
           }
        
           this.trigger('parsing');
           return modelDataArray;
        }

	});

	return ProfileCollection;
});
