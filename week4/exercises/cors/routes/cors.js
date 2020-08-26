const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = ["http://localhost:5000", "https://localhost:5443"];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;

  if (whitelist.indexOf(req.header("Origin") !== -1)) {
    corsOptions = { origin: false };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
