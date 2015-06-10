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
      template: _.template("<img id="+"profile"+" src=<%= imgUrl %>><p id="+"repo"+"><%= repoName %><p id=msg><%= commitMsg %></p>"),
      initialize: function(){
        this.render();
      },
      render: function(){
        // render the function using substituting the varible 'who' for 'world!'.
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      }
    }); 

    var paramInfo = '';
    var objData = '';
    $('#search').keypress(function(e) {
        paramInfo = $('#search').val();
        var key = e.which;
        if(key == 13) {
            $.ajax({
                type: "GET",
                url: '/git?name='+paramInfo,
            })
            .done(function(data) {
                console.log(data);
                var gitapp = new app.Git({imgUrl: data.actor.avatar_url, repoName: data.repo.name, commitMsg: data.payload.commits[0].message}); 
                var view = new ProfileView({model: gitapp});
            })
            .fail(function() {
                alert("ajax failed to fetch data");
            });
        }
    });
    
});
