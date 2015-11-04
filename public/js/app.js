$(document).ready(function() { 
    var GitCard = Backbone.Model.extend({
      defaults: {
        imgUrl: '',
        repoName: '',
        commitMsg: '',
        date: '',
        watch: '',
        watchUrl: '',
      }
   });

    var ProfileView = Backbone.View.extend({
      el: $('#container'),

      events: {
        'dblclick' : 'transform',
        'click .fa-times' : 'normal'
      },

      tagName: 'li',
 
      baseCard: "<li id='{{userID}}'class='col s4 truncate card-panel hoverable animated zoomIn git-cards'"+"><a target='_blank' href='http://github.com/{{user}}'><img class="+"profile"+" src={{imgUrl}}/><p class='name'>{{user}}</a></p><p class='date'>{{date}}</p><i class='fa fa-star star {{#watch}}{{/watch}}{{^watch}}hidden{{/watch}}'></i><a target='_blank' href='{{watchUrl}}'><p class='watch {{#watch}}{{/watch}}{{^watch}}hidden{{/watch}}'>{{#watch}}{{watch}}{{/watch}}</p></a><a target='_blank'  href='https://github.com/{{repoName}}'><p class='repo truncate'>{{repoName}}</a><a target='_blank' href='{{commitUrl}}'><p class='msg truncate'>{{commitSha}} {{commitMsg}}</p></a></li>",
    
      smallCardTemplate: "<a target='_blank' href='http://github.com/{{user}}'><img class="+"profile"+" src={{imgUrl}}/><p class='name'>{{user}}</a></p><p class='date'>{{date}}</p><i class='fa fa-star star {{#watch}}{{/watch}}{{^watch}}hidden{{/watch}}'></i><a target='_blank' href='{{watchUrl}}'><p class='watch {{#watch}}{{/watch}}{{^watch}}hidden{{/watch}}'>{{#watch}}{{watch}}{{/watch}}</p></a><a target='_blank'  href='https://github.com/{{repoName}}'><p class='repo truncate'>{{repoName}}</a><a target='_blank' href='{{commitUrl}}'><p class='msg truncate'>{{commitSha}} {{commitMsg}}</p></a>",

      largeCardTemplate: "<i class='fa fa-times'></i>"  
                         + "<img class='profile-large' src={{imgUrl}}/>"
                            + "<p class='name name-lg'><a target='_blank' href='http://github.com/{{user}}'>{{user}}</a></p>"
                         + "<ul class='personal-data'>"
                            + "{{#company}}"
                                + "<li class='company'><i class='fa fa-users'></i>{{company}}</li>"
                            + "{{/company}}"
                            + "{{#location}}"
                                + "<li class='location'><i class='fa fa-map-marker fg-2x'></i>{{location}}</li>"
                            + "{{/location}}"
                         + "</ul>"
                         + "<p class='date date-lg'>{{currentStreak}}</p>"
                         + "<i class='fa fa-star star {{#watch}}{{/watch}}{{^watch}}hidden{{/watch}}'></i>"
                         + "<a target='_blank' href='{{watchUrl}}'>"
                            + "<p class='watch {{#watch}}{{/watch}}{{^watch}}hidden{{/watch}}'>{{#watch}}{{watch}}{{/watch}}</p>"
                         + "</a>"
                         + "<a target='_blank' href='https://github.com/{{repoName}}'>"
                            + "<p class='repo truncate'>{{repoName}}</p>"
                         + "</a>"
                         + "<a target='_blank' href='{{commitUrl}}'>"
                             + "<p class='msg truncate'>{{commitSha}} {{commitMsg}}</p>"
                         + "</a>",

      initialize: function(){
        this.render();
        this.setElement('#'+this.model.get('userID'));
      },

      render: function() {
        this.$el.append((Mustache.render(this.baseCard, this.model.toJSON())));
        return this;
      },

      smallCardRender: function() {
        this.$el.html((Mustache.render(this.smallCardTemplate, this.model.toJSON())));
      },

      largeCardRender: function() {
        this.$el.html((Mustache.render(this.largeCardTemplate, this.model.toJSON())));
      },

      hide: function() {
        this.$el.hide();
      },

      show: function() {
        this.$el.show();
      },

      transform: function() {
        this.$el.empty();
        this.largeCardRender();
        this.$el.css("position", "fixed");
        this.$el.css("top", "70px");
        this.$el.height("600px");
        this.$el.width("600px");
        /*this.$el.animate({
            height: '500px',
            width: '600px'
        }, 500);*/
        this.$el.css("left", "50%");
        this.$el.css("margin-left", "-300px");
        this.$el.addClass("z-depth-5");
        this.$el.removeClass("hoverable");
        this.$el.css("z-index", "2");
      },

      normal: function() {
        //$('#'+this.model.get('userID')).hide(); 
        this.smallCardRender();
        this.hide();
        console.log(this.$el);
        $('#'+this.model.get('userID')).height('210px');
        $('#'+this.model.get('userID')).width('410px');
        this.$el.css({
            "left": "0",
            "margin-left": "15px",
        });
        
        this.$el.css("display", "inline-block");
        this.$el.removeClass("z-depth-5");
        this.$el.css("position", "static");
        this.$el.addClass("hoverable");
        this.show();
      }
    }); 

    var InputModel = Backbone.Model.extend({
        initialize: function() {
            console.log(this);
        }    
    });
    
    var ProfileCollection = Backbone.Collection.extend({
        comparator: function(model) {
            var date = new Date(model.get('dateString'));
            return -date;
        }
    });

    var ProfileCollectionView = Backbone.View.extend({
        collection: null,

        viewCollection: null,

        el: 'body',

        bindings: {
            '#search': 'inputVal'
        },

        initialize: function() {
            this.model = new InputModel({});
            this.listenTo(this.model, {
                'change:inputVal':this.updateText
            });
            this.inputVal = $("#search").val(); 
            this.stickit();
        },

        updateText: function(e) {
            console.log("updatedText");
            this.inputVal = $("#search").val();
            this.filter();
        },

        render: function() {
            var viewCollection = [];
            this.collection.forEach(function(item) {
                var view = new ProfileView({model: item});
                viewCollection.push(view);
            });
            this.viewCollection = viewCollection;
        },

        filter: function() {
            var inputValue = this.inputVal.toLowerCase();
            this.viewCollection.forEach(function(item) {
                var username = item.model.attributes.user.toLowerCase();
                if(username.indexOf(inputValue) > -1 || username.length === 0) {
                    $("#"+username).show();
                } else { 
                    $("#"+username).hide();
                } 
            });
        }
        
    });

    var profileCollection = new ProfileCollection();
    
    $('#spinner').show();
    $.ajax({
        type: "GET",
        url: '/geet',
    })
    .done(function(data) {
        $('#container').empty();
        for(var i in data) {
            if(data[i].eventData.pushEvents ) {
                console.log(data[i]);
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
                var gitCard = new GitCard({
                    imgUrl: data[i].eventData.pushEvents.actor.avatar_url, 
                    user: data[i].eventData.pushEvents.actor.login, 
                    userID: data[i].eventData.pushEvents.actor.login.toLowerCase(),
                    repoName: data[i].eventData.pushEvents.repo.name, 
                    commitMsg: commit,
                    commitSha: commitSha,
                    commitUrl: commitUrl,
                    date: "Last pushed "+moment(data[i].eventData.pushEvents.created_at).fromNow(),                 
                    dateString: data[i].eventData.pushEvents.created_at
                });
                if(data[i].eventData.watchEvents) {
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
                    location: data[i].personalData.personalData.location
                });
            }
        }
        if(profileCollection.length) {
            // User has friends, initial render
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
    .fail(function() {
        // 404 error
        $("#img-spinner").attr("src", "../assets/404.gif");
        $("#info").append("<span id='fourOfour'>404 Opps! Something went wrong... </span>");
    });
});
