define(['backbone'], function(Backbone) {

	var ProfileCollection = Backbone.Collection.extend({
	    comparator: function(model) {
	        var date = new Date(model.get('dateString'));
	        console.log(date);
	        return -date;
	    }
	});

	return ProfileCollection;
});