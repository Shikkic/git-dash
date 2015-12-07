define([
    "jquery",
    "moments",
    "mustache",
    "underscore",
    "backbone",
    "../../../js/models/gitcard",
    "../../../js/collections/profile-collection",
    "../../../js/collection-views/profile-collection-view"
], function($, Moments, Mustache, _, Backbone, GitCard, ProfileCollection, ProfileCollectionView) {

    // Initiliaze ProfileCollections
    var profileCollection = new ProfileCollection();

    // kick off the app
    $(document).ready(function() {
        $('#spinner').show();
        $.ajax({
            type: "GET",
            url: '/geet',
        })
        .done(function(data) {
            $('#container').empty(); 
            // TODO use map instead   
            for (var i in data) {
                if (data[i].eventData.pushEvents ) {
                    console.log(data[i]);
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

                    // Create a new gitCard Model
                    var gitCard = new GitCard({
                        imgUrl: data[i].eventData.pushEvents.actor.avatar_url, 
                        user: data[i].eventData.pushEvents.actor.login, 
                        userID: data[i].eventData.pushEvents.actor.login.toLowerCase(),
                        repoName: data[i].eventData.pushEvents.repo.name, 
                        commitMsg: commit,
                        commitSha: commitSha,
                        commitUrl: commitUrl,
                        date: "Last pushed "+Moments(data[i].eventData.pushEvents.created_at).fromNow(),                 
                        dateString: data[i].eventData.pushEvents.created_at
                    });

                    if (data[i].eventData.watchEvents) {
                        // If a user has watched events (stars) set them
                        gitCard.set({
                            watch: data[i].eventData.watchEvents.repo.name,
                            watchUrl: 'http://www.github.com/'+data[i].eventData.watchEvents.repo.name 
                        });
                    }

                    profileCollection.add(gitCard);
                    //var view = new ProfileView({model: gitCard});
                } if(data[i].contributions) {
                    gitCard.set({
                        currentStreak: data[i].contributions.currentStreaks,
                        longestStreak: data[i].contributions.longestStreaks,
                        totalContributions: data[i].contributions.totals
                    });
                } if(data[i].personalData) {
                    gitCard.set({
                        company: data[i].personalData.personalData.company,
                        location: data[i].personalData.personalData.location,
                        //TODO add these to the view
                        blog: data[i].personalData.personalData.blog
                        
                    });
                }
            }

            // User has friends, initial render
            if(profileCollection.length) {
                $('#spinner').hide();
                profileCollection.sort();
                var profileCollectionView = new ProfileCollectionView({collection: profileCollection});
                profileCollectionView.render();
            } else {
                // User has no Friends, display message
                $("#spinner").hide();
                $("#img-spinner").attr("src", "../assets/help.gif"); 
                $("#img-spinner").attr("id", "no-friends");
                $("#info").append("<span id='no-friends-text'>Looks like you don't have any friends on <a href='http://www.github.com'>Github</a>, try adding some and come back! <3</span");
                $("#spinner").show();
            }

        })

        // 404 error
        .fail(function() {
            $("#img-spinner").attr("src", "../assets/404.gif");
            $("#info").append("<span id='fourOfour'>404 Opps! Something went wrong... </span>");
        });

    });
});
