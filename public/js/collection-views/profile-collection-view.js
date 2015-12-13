define([
	'backbone',
	'stickit',
	'../../../js/models/input',
	"../views/profile-view",
    "../collections/profile-collection"
], function(Backbone, Stickit, InputModel, ProfileView, ProfileCollection) {

	var ProfileCollectionView = Backbone.View.extend({

        viewCollection: null,

        el: 'body',

        bindings: {
            '#search': 'inputVal'
        },

        initialize: function() {
            this.collection = new ProfileCollection;
            this.toggleLoader({init: true});

            // TODO Fix this
            this.model = new InputModel({});

            this.listenTo(this.model, {'change:inputVal':this.updateText});
            this.listenTo(this.collection, 'update', this.toggleLoader);


            this.collection.fetch({
                success: _.bind(function() {
                    this.trigger("update"); 
                }, this) 
            });

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
        },

        toggleLoader: function(options) {
            //TODO Might want these to be properties of the collection-view, not the page view
            options = (options || {});
            if (!this.collection.length && options.init) {
                // Toggle has been called, but it's the initial call
                $('#spinner').show();
            } else if (!this.collection.length && !options.init) {
                // Collection has fetched, but it's empty
                this.toggleEmptyView();
            } else {
                // We have a colletion to render that is NOT Empty
                $('#spinner').hide();
                this.render();
            }
        },

        toggleEmptyView : function() {
            // TODO REFACTOR THIS TO RENDER AN EMPTY TEMPLATE
            // TODO Might want these to be properties of the collection-view, not the page view
            $("#spinner").hide();
            $("#img-spinner").attr("src", "../assets/help.gif");
            $("#img-spinner").attr("id", "no-friends");
            $("#info").append("<span id='no-friends-text'>Looks like you don't have any friends on <a href='http://www.github.com'>Github</a>, try adding some and come back! <3</span");
            $("#spinner").show();
        }

    });

	return ProfileCollectionView;
});
