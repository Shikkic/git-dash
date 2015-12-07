define([
  'backbone',
  'mustache',
  "text!../../../templates/base-card.mustache",
  "text!../../../templates/small-card.mustache",
  "text!../../../templates/large-card.mustache"
], function(Backbone, Mustache, BaseCardTemplate, SmallCardTemplate, LargeCardTemplate) {

  console.log(BaseCardTemplate);
  console.log(SmallCardTemplate);


  var ProfileView = Backbone.View.extend({

      el: $('#container'),

      events: {
        'dblclick' : 'transform',
        'click .fa-times' : 'normal'
      },

      tagName: 'li',
 
      baseCard: BaseCardTemplate,
    
      smallCardTemplate: SmallCardTemplate,

      largeCardTemplate: LargeCardTemplate,

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

  return ProfileView;

  });
