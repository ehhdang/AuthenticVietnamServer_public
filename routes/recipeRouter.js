/**
 * import external modules and dependencies
 */
const express = require("express");
const Recipe = require("../models/recipe");
const Comment = require("../models/comment");
const Ingredient = require("../models/ingredient");
const Direction = require("../models/direction");
const cors = require("../cors");
const authenticate = require("../authenticate");

/**
 * router configuration
 */
const recipeRouter = express.Router();
recipeRouter.use(express.json());

recipeRouter.options('*', cors.corsWithOptions, (req, res) => {
    res.status(200);
})

recipeRouter.route("/")
    .get((req, res, next) => {
        Recipe.find({})
            .populate("ingredients")
            .populate("directions")
            .populate({
                path: "comments",
                populate: { path: "author" }
            })
            .then(recipes => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(recipes);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recipe.create(req.body)
            .then(recipe => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(recipe);
            }, err => next(err))
            .catch(err => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recipe.deleteMany({})
            .then(response => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

recipeRouter.route("/recipe")
    .get((req, res, next) => {
        Recipe.findOne({ _id: req.query.recipeId})
            .populate("ingredients")
            .populate("directions")
            .populate({
                path: "comments",
                populate: { path: "author" }
            })
            .then(recipe => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(recipe);
            }, err => next(err))
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recipe.findOneAndUpdate({ _id: req.query.recipeId }, { $set: req.body }, { new: true })
            .then(recipe => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(recipe);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recipe.findOneAndDelete({ _id: req.query.recipeId })
            .then(response => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

recipeRouter.route("/recipe/comments")
    .get((req, res, next) => {
        Recipe.findOne({ _id: req.query.recipeId })
            .populate({
                path: "comments",
                populate: { path: "author" }
            })
            .then(recipe => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(recipe.comments);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        // allow authorized user to post a comment
        Comment.create(req.body)
            .then(comment => {
                Recipe.findOne({ _id: req.query.recipeId })
                    .then(recipe => {
                        recipe.comments.push(comment);
                        recipe.save()
                            .then(recipe => {
                                Recipe.findOne({ _id: recipe._id })
                                    .populate({
                                        path: "comments",
                                        populate: { path: "author" }
                                    })
                                    .then(recipe => {
                                        res.status(200);
                                        res.set("Content-type", "application/json");
                                        res.json(recipe.comments);
                                    }, err => next(err))
                                    .catch(err => next(err));
                                }, err => next(err))
                            .catch(err => next(err));
                    }, err => next(err))
                    .catch(err => next(err))
            }, err => next(err))
            .catch(err => next(err))
    })
    .patch(authenticate.verifyUser, (req, res, next) => {
        // allow authorized user to modify their comment
        Comment.findOneAndUpdate({ _id: req.query.commentId }, { $set: req.body }, { new: true })
            .populate("author")
            .then(comment => {
                Recipe.findOne({ _id: req.query.recipeId })
                    .populate({
                        path: "comments",
                        populate: { path: "author" }
                    })
                    .then(recipe => {
                        res.status(200);
                        res.set("Content-Type", "application/json");
                        res.json(recipe.comments);
                    }, err => next(err))
                    .catch(err => next(err))
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        // allow authorized user to delete their comment
        Comment.findOneAndDelete({ _id: req.query.commentId })
            .then(response => {
                Recipe.findOne({ _id: req.query.recipeId })
                    .then(recipe => {
                        const i = recipe.comments.indexOf(req.query.commentId);
                        recipe.comments = [...recipe.comments.slice(0, i), ...recipe.comments.slice(i+1)];
                        recipe.save()
                            .then(recipe => {
                                Recipe.findOne({ _id: recipe._id })
                                    .populate({
                                        path: "comments",
                                        populate: { path: "author" }
                                    })
                                    .then(recipe => {
                                        res.status(200);
                                        res.set("Content-type", "application/json");
                                        res.json(recipe.comments);
                                    }, err => next(err))
                                    .catch(err => next(err))
                            }, err => next(err))
                            .catch(err => next(err))
                    }, err => next(err))
                    .catch(err => next(err))
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = recipeRouter;
