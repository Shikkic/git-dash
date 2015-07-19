var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    github : {
        id : String,
        token : String,
        name: String,
        username : String,
        url : String,
    }
});

module.exports = mongoose.model('User', userSchema);
