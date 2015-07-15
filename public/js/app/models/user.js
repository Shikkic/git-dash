var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    github : {
        id : String,
        token : String,
        name: String,
        email : String,
        url : String,
        following : String
    }
});

module.exports = mongoose.model('User', userSchema);
