/**
 * import external modules and required dependencies
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema configuration
 */
const directionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    details: [{
        type: String,
        required: true,
    }]
});

var Direction = mongoose.model("Direction", directionSchema);
module.exports = Direction;