/**
 * import external modules and required dependencies
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/user");

/**
 * Schema configuration
 */
const commentSchema = new Schema({
    rating: {
        type: Number,
        max: 5,
        min: 1,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    }
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;