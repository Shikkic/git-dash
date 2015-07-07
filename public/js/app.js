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

      template: _.template("<li  class='col s4 truncate card-panel hoverable animated zoomIn git-cards'"+"><a href='http://github.com/<%= user %>'><img id="+"profile"+" src=<%= imgUrl %>/><p id='name'><%= user %></a></p><p id='date'><%= date %></p><a href='https://github.com/<%= repoName %>'><p id="+"repo"+"><%= repoName %></a><p id=msg>Commit Msg: <%= commitMsg %></p></li>"),
      
      initialize: function(){
        this.render();
      },

      render: function(){
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
