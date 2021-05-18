/**
 * import required dependencies and external modules
 */
const express = require("express");
const Direction = require("../models/direction");
const cors = require("../cors");
const authenticate = require("../authenticate");

/**
 * router initialization
 */
const directionRouter = express.Router();
directionRouter.use(express.json());

/**
 * router config
 */

directionRouter.options("*", cors.corsWithOptions, (req, res) => {
    res.status(200);
});
  
directionRouter.route("/")
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Direction.find({})
            .then(direction => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(direction);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Direction.create(req.body)
            .then(direction => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(direction);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Direction.deleteMany({})
            .then(response => {
                res.status(200);
                res.set("Content-type", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

directionRouter.route("/direction")
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Direction.findOne({ _id: req.body.directionId } )
            .then(direction => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(direction);
            }, err => next(err))
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Direction.findOneAndUpdate({ _id: req.body.directionId }, { $set: req.body.direction }, { new: true })
            .then(direction => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(direction);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Direction.findOneAndDelete({ _id: req.body.directionId })
            .then(response => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = directionRouter;