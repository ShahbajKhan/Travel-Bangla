var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    aboutUser: String,
    email: String,
    password: String,
    avatar: String,
    isAdmin:  {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);