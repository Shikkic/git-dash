$(document).ready(function() {

   var app = {};
   app.Git = Backbone.Model.extend({
      defaults: {
        imgUrl: '',
        repoName: '',
        commitMsg: ''
      }
   });
    
    var ProfileView = Backbone.View.extend({
      el: $('#container'),

      tagName: 'li',

      template: _.template("<li id="+"cards"+ " class='.col-md-4 animated zoomIn'"+"><a href='http://github.com/<%= user %>'><img id="+"profile"+" src=<%= imgUrl %>/></a><p id='name'><%= user %></p><p id="+"repo"+">Repo name: <%= repoName %><p id=msg>Commit Msg: <%= commitMsg %></p></li>"),
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
                url: '/git?name='+paramInfo,
            })
            .done(function(data) {
                console.log(data);
                var gitapp = new app.Git({
                    imgUrl: data.actor.avatar_url, 
                    user: data.actor.login, 
                    repoName: data.repo.name, 
                    commitMsg: data.payload.commits[0].message
            }); 
                var view = new ProfileView({model: gitapp});
            })
            .fail(function() {
                alert("ajax failed to fetch data");
            });
        }
    });

});
