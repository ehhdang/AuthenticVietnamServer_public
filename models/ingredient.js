/**
 * import external modules and required dependencies
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema configuration
 */
const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    recommended: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: false
    }
});

var Ingredient = mongoose.model("Ingredient", ingredientSchema);
module.exports = Ingredient;