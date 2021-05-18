/**
 * require external modules, middlewares, and interfaces
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");

const { clientOrigins, serverPort } = require("./config/env.dev");

const recipeRouter = require("./routes/recipeRouter");
const ingredientRouter = require("./routes/ingredientRouter");
const directionRouter = require("./routes/directionRouter");
const userRouter = require("./routes/users");
const index = require("./routes/index");

/**
 * app variables
 */
const app = express();

/**
 * app configurations
 */
app.use(helmet());
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

app.use(passport.initialize());

app.use('/recipes', recipeRouter);
app.use("/ingredients", ingredientRouter);
app.use("/directions", directionRouter);
app.use("/users", userRouter);
app.use("/", index);

// app.use("/.well-known", express.static(".well-known"));

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
});

app.use((req, res, next) => {
    res.status(404).send("Sorry! That route does not exisit. Have a nice day!");
})

/**
 * Server activation
 */

app.listen(serverPort, () => {
    console.log(`Backend Server is running at http://localhost:${serverPort}`);
});

/**
 * MongoDB connection
 */
const dbname = "authenticVietnamese";
const mongodbUrl = `mongodb+srv://OrangeCalico:ha29NOiFd@basic.rjcpe.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

client.then((databse) => {
    console.log("Successfully connect to MongoDB Atlast with Mongoose");
}, (err) => { console.log(err) });

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true` by default, so you need to set it to false.
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// Fix the (node:27889) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

