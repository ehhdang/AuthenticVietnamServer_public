const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Recipe = require("./recipe");

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: "",
    },
    admin: {
        type: Boolean,
        default: false
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: Recipe
    }]
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
});

var User = mongoose.model("User", userSchema);
module.exports = User;
