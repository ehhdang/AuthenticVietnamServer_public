/**
 * import required dependencies and external modules
 */
const express = require("express");
const Ingredient = require("../models/ingredient");
const cors = require("../cors");
const authenticate = require("../authenticate");

/**
 * Router initialize
 */
const ingredientRouter = express.Router();
ingredientRouter.use(express.json());

/**
 * Router config
 */

ingredientRouter.options("*", cors.corsWithOptions, (req, res) => {
    res.status(200);
});

ingredientRouter.route("/")
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Ingredient.find({})
            .then(ingredients => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(ingredients);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Ingredient.create(req.body)
            .then(ingredient => {
                res.status(200);
                res.set("Content-Types", "application/json");
                res.json(ingredient);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Ingredient.deleteMany({})
            .then(response => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

ingredientRouter.route("/ingredient")
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Ingredient.findOne({ _id: req.body.ingredientId })
            .then(ingredient => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(ingredient);
            }, err => next(err))
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Ingredient.findOneAndUpdate({ _id: req.body.ingredientId }, { $set: req.body.ingredient }, { new: true })
            .then(ingredient => {
                res.status(200);
                res.set("Content-Types", "application/json");
                res.json(ingredient);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Ingredient.findOneAndDelete({ _id: req.body.ingredientId })
            .then(response => {
                res.status(200);
                res.set("Content-Types", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = ingredientRouter;