const express = require("express");
const cors = require("cors");

const whitelist = ["http://localhost:8080", "http://localhost:4200", "https://authenticvietnam-e6ee0.web.app", "https://authenticvietnam-e6ee0.uc.r.appspot.com"];

const corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if ( whitelist.indexOf(req.header("Origin")) != -1 ) {
        corsOptions = { origin: true }; // Access-Control-Allow-Origin returned by server
    } else {
        corsOptions = { origin: false }; // Access-Controle-Allow-Origin not included in response from server
    };

    callback(null, corsOptions);
}

exports.cors = cors(); // reply with Access-Control-Allow-Origin: *
exports.corsWithOptions = cors(corsOptionsDelegate); // reply with Access-Control-Allow-Origin for origins in white list