$(document).ready(function() {
   GitCard = Backbone.Model.extend({
      defaults: {
        imgUrl: '',
        repoName: '',
        commitMsg: '',
        date: '',
      }
   });
    
    var ProfileView = Backbone.View.extend({
      el: $('#container'),

      tagName: 'li',

      template: _.template("<li  class='col s4 truncate card-panel hoverable animated zoomIn git-cards'"+"><a href='http://github.com/<%= user %>'><img class="+"profile"+" src=<%= imgUrl %>/><p class='name'><%= user %></a></p><p class='date'><%= date %></p><a href='https://github.com/<%= repoName %>'><p class="+"repo"+"><%= repoName %></a><p class=msg>Commit Msg: <%= commitMsg %></p></li>"),
      
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
                    if(data[i]) {
                        var gitCard = new GitCard({
                            imgUrl: data[i].actor.avatar_url, 
                            user: data[i].actor.login, 
                            repoName: data[i].repo.name, 
                            commitMsg: data[i].payload.commits[0].message,
                            date: "Last pushed "+moment(data[i].created_at).fromNow()
                        });
                    
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
