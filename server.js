const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const chalk = require('chalk');
const errorMsg = chalk.bgKeyword('white').redBright;
var cookieParser = require('cookie-parser');
const csp = require('helmet-csp');
const helmet = require("helmet-csp");
const routes = require("./routes/route.js");
const { mongo_url } = require('./config');
const session = require('express-session');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Configure session middleware
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));

// connect to mongodb
mongoose
  .connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((res) => console.log(('Connected to DB')))
  .catch((error) => console.log((error)));
// routes
app.use(routes);

// start user
app.listen(process.env.PORT || 8080, (error)=> {
  // console.log(`Listening port `+process.env.PORT || 8080);
});

// Content-Security-Policy pro bezpecnost
app.use(csp({
   directives: {
      defaultSrc: ["'self'"],  // default value for all directives that are absent
      scriptSrc: ["'self'"],   // helps prevent XSS attacks
      frameAncestors: ["'none'"],  // helps prevent Clickjacking attacks
      imgSrc: ["'self'", "'http://imgexample.com'"],
      styleSrc: ["'none'"]
    }
}));

module.exports = app;