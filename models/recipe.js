/**
 * import external modules and dependencies
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 /**
  * Define the schemas
  */
const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    servings: {
        type: Number
    },
    ingredients: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Ingredient"
    }],
    directions: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Direction"
    }],
    comments: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment"
    }]
});

var Recipe = mongoose.model("Recipe", recipeSchema)
module.exports = Recipe;