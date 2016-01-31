define(['backbone'], function(Backbone) {

    var InputModel = Backbone.Model.extend({
        initialize: function() {
            console.log(this);
        }
    });

    return InputModel;
});
