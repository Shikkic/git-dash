define(['backbone'], function(Backbone) {
    
    var NavStats = Backbone.Model.extend({ 
        url: '/userNavBarStats'
    });

    return NavStats;
});
