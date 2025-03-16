const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// Import DB connection
require("./utills/dbconnection");

const options = {
  key: fs.readFileSync("/app/ssl/privkey.pem"),   // Path inside Docker container
  cert: fs.readFileSync("/app/ssl/fullchain.pem") // Path inside Docker container
};

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("/start", (req, res) => {
  res.status(200).json({ msg: "hi--" });
});

app.use("/", indexRouter);
app.use("/adminaccount", usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Cron job
const schedule = "* * * * *";
const task = async () => {
  await axios.put("http://localhost:5000/adminaccount/todaycustomerupdate");
};
cron.schedule(schedule, task);
console.log("Cron job scheduled to run at 12 AM.");

// **Start HTTPS Server**
const port = process.env.PORT || 5000;
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

module.exports = app;
