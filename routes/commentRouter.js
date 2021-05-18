/**
 * import external modules and required dependencies
 */
const express = require("express");
const Comment = require("../models/comment");
const cors = require("../cors");
const authenticate = require("../authenticate");

/**
 * Router config
 */
const commentRouter = express.Router();
commentRouter.use(express.json());

commentRouter.options("*", cors.corsWithOptions, (req, res) => {
    res.status(200);
})

commentRouter.route("/")
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Comment.find({})
            .then(comments => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(comments);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Comment.create(req.body)
            .populate("author")
            .then(comment => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(comment);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Comment.deleteMany({})
            .then(response => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

commentRouter.route("/comment")
    .put(authenticate.verifyUser, (req, res, next) => {
        Comment.findOneAndUpdate({ _id: req.body.commentId }, { $set: req.body.comment }, { new: true })
            .populate("author")
            .then(comment => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(comment);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Comment.findOneAndDelete({ _id: req.body.commentId })
            .then(response => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = commentRouter;