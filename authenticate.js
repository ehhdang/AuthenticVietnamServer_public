/**
 * require external modules, middlewares, and interfaces
 */
const passport = require("passport");
const fs = require("fs");
const jwt = require("jsonwebtoken");

// local strategy authenticates users with username and password
const LocalStrategy = require("passport-local").Strategy; 

// User provides methods that could be used as "verify" callbacks for passport
const User = require("./models/user");

passport.use( new LocalStrategy({ usernameField: "email" }, User.authenticate() ));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const JwtStrategy = require("passport-jwt").Strategy; // strategy to validate a Jwt
const ExtractJwt = require("passport-jwt").ExtractJwt; // strategy to extract a Jwt from the req.header

const RSA_PRIVATE_KEY = fs.readFileSync("./bin/private.key");
const RSA_PUBLIC_KEY = fs.readFileSync("./bin/public.key");

exports.getToken = (user) => {
    return jwt.sign(user, RSA_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: 86400
    });
}

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: RSA_PUBLIC_KEY
};

passport.use( new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id },
            (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
    }));

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        var err = new Error("You are not authorized to perform this operation!");
        err.status(403);
        next(err);
    }
};