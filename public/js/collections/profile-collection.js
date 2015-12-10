define([
    'backbone',
    'moments',
    '../models/gitcard.js'
], function(Backbone, Moments, GitCardModel) {

	var ProfileCollection = Backbone.Collection.extend({

        model: GitCardModel,

        initialize: function(options) {
            _.bindAll(this, 'fetch', 'parse');
            // First lets fetch the data we'll need and created   
            console.log("initializing");
            console.log(this);
        },
            
	    comparator: function(model) {
	        var date = new Date(model.get('dateString'));
	        return -date;
	    },

        fetch: function(options) {
            var _this = this;

            $.ajax({
                type: 'GET',
                url: '/geet'
            })
            .done(function(data) {
                console.log(this);
                console.log("fetch is done and 200 = ", data);
                return data;
            })
            .fail(function() {
                // TODO trigger an error event which should trigger the error render event
                console.log("fetch failed");
                return null;
            });
        },

        parse: function(response) {
            console.log("parsing");
            console.log(response);
            var modelDataArray = [];
            var data = response;
            for (var i in data) {
                var userData = data[i];
                if (userData.eventData.pushEvents ) {
                    // Throwing error since some commits didn't have specifc data
                    if (data[i].eventData.pushEvents.payload.commits[0]) {
                        var commit = data[i].eventData.pushEvents.payload.commits.length ? data[i].eventData.pushEvents.payload.commits[0].message : " ";
                        var commitMsg = data[i].eventData.pushEvents.payload.commits.length ? data[i].eventData.pushEvents.payload.commits[0].sha.slice(0 ,5) : "";
                        var commitSha = data[i].eventData.pushEvents.payload.commits[0].sha.slice(0,5);
                        var commitUrl ='http://github.com/'+data[i].eventData.pushEvents.repo.name+'/commit/'+data[i].eventData.pushEvents.payload.commits[0].sha;
                    } else {
                        var commit = "";
                        var commitMsg = "";
                        var commitSha = "";
                        var commitUrl = "";
                    }


                    gitCardModelData = {
                        imgUrl: userData.eventData.pushEvents.actor.avatar_url,
                        user: userData.eventData.pushEvents.actor.login,
                        userID: userData.eventData.pushEvents.actor.login.toLowerCase(),
                        repoName: userData.eventData.pushEvents.repo.name,
                        commitMsg: commit,
                        commitSha, commitSha,
                        commitUrl: commitUrl,
                        data: "Last pushed "+ Moments(userData.eventData.pushEvents.created_at).fromNow(),
                        dateString: userData.eventData.pushEvents.created_at
                    };
                        

                    if (userData.eventData.watchEvents) {
                        // If a user has watched events (stars) set them
                        gitCardModelData.watch = userData.eventData.watchEvents.repo.name;
                        gitCardModelData.watchUrl = 'http://www.github.com/'+data[i].eventData.watchEvents.repo.name; 
                    }

                } if (userData.contributions) {
                        gitCardModelData.currentStreak = userData.contributions.currentStreaks;
                        gitCardModelData.longestStreak = userData.contributions.longestStreaks;
                        gitCardModelData.totalContributions = userData.contributions.totals;
                } if (userData.personalData) {
                        gitCardModelData.company = userData.personalData.personalData.company;
                        gitCardModelData.location = userData.personalData.personalData.location;
                        //TODO add these to the view
                        gitCardModelData.blog = userData.personalData.personalData.blog;
                }

                modelDataArray.push(gitCardModelData);
            }

            /*// User has friends, initial render
            if(profileCollection.length) {
                $('#spinner').hide();
                profileCollection.sort();
                var profileCollectionView = new ProfileCollectionView({collection: profileCollection});
                profileCollectionView.render();
            } */
           console.log(modelDataArray);
           return modelDataArray;
        }

	});

	return ProfileCollection;
});
