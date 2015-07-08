$(document).ready(function() {
   GitCard = Backbone.Model.extend({
      defaults: {
        imgUrl: '',
        repoName: '',
        commitMsg: '',
        date: '',
        watch: 'none',
        watchUrl: ''
      }
   });
    
    var ProfileView = Backbone.View.extend({
      el: $('#container'),

      tagName: 'li',

      template: _.template("<li  class='col s4 truncate card-panel hoverable animated zoomIn git-cards'"+"><a href='http://github.com/<%= user %>'><img class="+"profile"+" src=<%= imgUrl %>/><p class='name'><%= user %></a></p><p class='date'><%= date %></p><i class='fa fa-star star'></i><a href='<%= watchUrl  %>'><p class='watch'><%= watch %></p></a><a href='https://github.com/<%= repoName %>'><p class="+"repo"+"><%= repoName %></a><p class=msg>Commit Msg: <%= commitMsg %></p></li>"),
      
      initialize: function(){
        this.render();
      },

      render: function(){
        this.$el.append(this.template(this.model.toJSON()));
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
