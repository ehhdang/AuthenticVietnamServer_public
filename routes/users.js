const express = require("express");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const passport = require("passport");
const authenticate = require("../authenticate");
const cors = require("../cors");

const router = express.Router();
router.use(express.json());

router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

router.get("/", cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
    (req, res, next) => {
        User.find({})
            .then(users => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(users);
            }, err => next(err))
            .catch(err => next(err));
});

router.post("/signup", cors.corsWithOptions, (req, res, next) => {
    User.register({ email: req.body.email },
        req.body.password, (err, user) => {
            if (err) {
                res.status(500);
                res.set("Content-Type", "application/json");
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                if (req.body.picture) {
                    user.picture = req.body.picture;
                }
                user.save((err, user) => {
                    if (err) {
                        res.status(200);
                        res.set("Content-Type", "application/json");
                        res.json({err: err});
                        return;
                    };
                    passport.authenticate("local")(req, res, () => {
                        res.status(200);
                        res.set("Content-Type", "application/json");
                        res.json({ 
                            success: true, 
                            status: "registration succeeds"
                        });
                    });
                });
            };
        });
});

router.post("/login", cors.corsWithOptions, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        };
        if (!user) {
            // user login was unsuccessfull
            res.status(401);
            res.set("Content-Type", "application/json");
            res.json({
                success: false,
                status: "Login fails",
                err: info
            });
        } else {
            // user login was successful
            req.logIn(user, err => {
                if (err) {
                    res.status(401);
                    res.set("Content-Type", "application/json");
                    res.json({
                        success: false,
                        status: "Login fails",
                        err: "Could not log in user"
                    });
                } else {
                    var token = authenticate.getToken({_id: user._id});
                    res.status(200);
                    res.set("Content-Type", "application/json");
                    res.json({
                        success: true,
                        token: token,
                        status: "Login succeeds",
                        expiresIn: 86400
                    })
                }
            })
        }
    }) (req, res, next);
});

router.post("/logout", cors.corsWithOptions, (req, res, next) => {
    req.logOut();
    res.status(200);
    res.json("You are logged out!");
});

router.route("/user")
    .get(cors.corsWithOptions,(req, res, next) => {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if (err) {
              return next (err);
            };
            if (!user) {
                //user is NOT valid
                res.status(401);
                res.set('Content-Type', 'application/json');
                return res.json(null);
            } else {
                //user is a valid user, allowed to proceed forward
                res.status(200);
                res.set("Content-Type", "application/json");
                return res.json(user);
            };
        }) (req, res);
    })
    .patch(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOneAndUpdate({_id: req.user._id}, {$set: req.body.user}, {new: true})
            .then(user => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(user);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOneAndDelete({_id: req.user._id})
            .then(response => {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(response);
            }, (err) => next(err))
            .catch(err => next(err));
    });

router.route("/user/favorites")
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOne({_id: req.user._id})
            .then(user => {
                Recipe.find({_id: {$in: user.favorites}})
                    .populate("ingredients")
                    .populate("directions")
                    .populate("comments")
                    .populate("comment.author")
                    .then(recipes => {
                        res.status(200);
                        res.set("Content-Type", "application/json");
                        res.json(recipes);
                    }, err => next(err))
                    .catch(err => next(err));
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOne({_id: req.user})
            .then(user => {
                user.favorites = [];
                user.save()
                    .then(user => {
                        res.status(200);
                        res.set("Content-Type", "application/json");
                        res.json(user.favorites);
                    }, err => next(err))
                    .catch(err => next(err));
            }, err => next(err))
            .catch(err => next(err));
    });

router.route("/user/favorites/add")
    .patch(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOne({_id: req.user._id})
            .then(user => {
                user.favorites.push(req.body.recipeId);
                user.save()
                    .then(user => {
                        Recipe.find({_id: {$in: user.favorites}})
                            .populate("ingredients")
                            .populate("directions")
                            .populate("comments")
                            .populate("comment.author")
                            .then(recipes => {
                                res.status(200);
                                res.set("Content-Type", "application/json");
                                res.json(recipes);
                            }, err => next(err))
                            .catch(err => next(err));
                    }, err => next(err))
                    .catch(err => next(err));
            }, err => next(err))
            .catch(err => next(err));
    });

router.route("/user/favorites/remove")
    .patch(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOne({_id: req.user._id})
            .then(user => {
                const i = user.favorites.indexOf(req.body.recipeId);
                user.favorites = [...user.favorites.slice(0, i), ...user.favorites.slice(i+1)];
                user.save()
                    .then(user => {
                        Recipe.findOne({_id: {$in: user.favorites}})
                            .populate("ingredients")
                            .populate("directions")
                            .populate("comments")
                            .populate("comment.author")
                            .then(recipes => {
                                res.status(200);
                                res.set("Content-Type", "application/json");
                                res.json(recipes);
                            }, err => next(err))
                            .catch(err => next(err));
                    }, err => next(err))
                    .catch(err => next(err));
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = router;

