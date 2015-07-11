

$(document).ready(function() {
   var GitCard = Backbone.Model.extend({
      defaults: {
        imgUrl: '',
        repoName: '',
        commitMsg: '',
        date: '',
        watch: 'n/a',
        watchUrl: ''
      }
   });
    
    var ProfileView = Backbone.View.extend({
      el: $('#container'),

      tagName: 'li',
 
      template: "<li  class='col s4 truncate card-panel hoverable animated zoomIn git-cards'"+"><a target='_blank' href='http://github.com/{{user}}'><img class="+"profile"+" src={{imgUrl}}/><p class='name'>{{user}}</a></p><p class='date'>{{date}}</p><i class='fa fa-star star'></i><a target='_blank' href='{{watchUrl}}'><p class='watch'>{{#watch}}{{watch}}{{/watch}}</p></a><a target='_blank'  href='https://github.com/{{repoName}}'><p class='repo truncate'>{{repoName}}</a><a target='_blank' href='{{commitUrl}}'><p class='msg truncate'>{{commitSha}} {{commitMsg}}</p></a></li>",
     
      initialize: function(){
        this.render();
      },

      render: function(){
        this.$el.append((Mustache.render(this.template, this.model.toJSON())));
        return this;
      }
    }); 

    var ProfileCollection = Backbone.Collection.extend({
        comparator: function(a) {
            return a.get('date');
        }
    });

    var profileCollection = new ProfileCollection();

    var paramInfo = '';
    var objData = '';

    $('#search').keypress(function(e) {
        paramInfo = $('#search').val();
        var key = e.which;
        if(key == 13) {
            $('#spinner').show();
            $('#search').val('');
            $.ajax({
                type: "GET",
                url: '/geet?name='+paramInfo,
            })
            .done(function(data) {
                $('#spinner').hide();
                console.log(data);
                for(var i in data) {
                    if(data[i].pushEvents ) {
                        var gitCard = new GitCard({
                            imgUrl: data[i].pushEvents.actor.avatar_url, 
                            user: data[i].pushEvents.actor.login, 
                            repoName: data[i].pushEvents.repo.name, 
                            commitMsg: data[i].pushEvents.payload.commits[0].message,
                            commitSha: data[i].pushEvents.payload.commits[0].sha.slice(0,5),
                            commitUrl: 'http://github.com/'+data[i].pushEvents.repo.name+'/commit/'+data[i].pushEvents.payload.commits[0].sha,
                            date: "Last pushed "+moment(data[i].pushEvents.created_at).fromNow()
                        });
                        if(data[i].watchEvents) {
                            gitCard.set({
                                watch: data[i].watchEvents.repo.name,
                                watchUrl: 'http://www.github.com/'+data[i].watchEvents.repo.name 
                            });
                        }
                        console.log(gitCard.watch);
                        profileCollection.add(gitCard);
                        var view = new ProfileView({model: gitCard});
                    }
                }
                console.log(profileCollection);
            })
            .fail(function() {
                alert("ajax failed to fetch data");
            });
        }
    });

});
