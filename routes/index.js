const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (req, res, next) => {
    res.status(200);
    res.set("Content-Type", "application/json");
    res.json("empty page");
});

module.exports = indexRouter;