define([
	'backbone',
	'stickit',
	'../../../js/models/input',
	"../views/profile-view"
], function(Backbone, Stickit, InputModel, ProfileView) {

	var ProfileCollectionView = Backbone.View.extend({
        collection: null,

        viewCollection: null,

        el: 'body',

        bindings: {
            '#search': 'inputVal'
        },

        initialize: function() {
            this.model = new InputModel({});
            this.listenTo(this.model, {'change:inputVal':this.updateText});
            this.inputVal = $("#search").val(); 
            this.stickit();
        },

        updateText: function(e) {
            this.inputVal = $("#search").val();
            this.filter();
        },

        render: function() {
            var viewCollection = [];
            // Use different _.each instead 
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

	return ProfileCollectionView;
});
