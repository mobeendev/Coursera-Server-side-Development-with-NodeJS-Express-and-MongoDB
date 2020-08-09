var createError = require("http-errors");
var express = require("express");
var path = require("path");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");
const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

var app = express();

// setting up express-seesions
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

//  checking the connection
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// User Auth APIs
app.use("/users", usersRouter);

app.use(auth);

// Dishes APIs
app.use("/dishes", dishRouter);
// Leaders APIs
app.use("/leaders", leaderRouter);
// Promotions APIs
app.use("/promotions", promoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    var err = new Error("You are not authenticated!");
    err.status = 403;
    return next(err);
  } else {
    if (req.session.user === "authenticated") {
      next();
    } else {
      var err = new Error("You are not authenticated!");
      err.status = 403;
      return next(err);
    }
  }
}
