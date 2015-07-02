$(document).ready(function() {

   var app = {};
   app.Git = Backbone.Model.extend({
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

      template: _.template("<li id="+"cards"+ " class='.col-md-4 animated zoomIn'"+"><a href='http://github.com/<%= user %>'><img id="+"profile"+" src=<%= imgUrl %>/></a><p id='name'><%= user %></p><p id='date'><%= date %></p><p id="+"repo"+"><%= repoName %><p id=msg>Commit Msg: <%= commitMsg %></p></li>"),
      initialize: function(){
        this.render();
      },

      render: function(){
        // render the function using substituting the varible 'who' for 'world!'.
        this.$el.append(this.template(this.model.toJSON()));
        return this;
      }
    }); 

    var paramInfo = '';
    var objData = '';

    $('#search').keypress(function(e) {
        paramInfo = $('#search').val();
        var key = e.which;
        if(key == 13) {
            $('#search').val('');
            $.ajax({
                type: "GET",
                url: '/geet?name='+paramInfo,
            })
            .done(function(data) {
                console.log(data);
                for(var i in data) {
                    var gitapp = new app.Git({
                        imgUrl: data[i].actor.avatar_url, 
                        user: data[i].actor.login, 
                        repoName: data[i].repo.name, 
                        commitMsg: data[i].payload.commits[0].message,
                        date: new Date(data[i].created_at)
                    }); 
                    var view = new ProfileView({model: gitapp});
                }
            })
            .fail(function() {
                alert("ajax failed to fetch data");
            });
        }
    });

});
