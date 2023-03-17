const express = require('express');
const app = express();
const http = require('http');
var cookieParser = require('cookie-parser');
const csp = require('helmet-csp');
const helmet = require("helmet-csp");
const routes = require("./routes/route.js");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// var nodemailer = require('nodemailer');
// const { email, password } = require('./config');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: email,
//     pass: password
//   }
// });

// var mailOptions = {
//   from: email,
//   to: 'mikhail.starkov@tul.cz',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

// routes
app.use(routes);

// start user
app.listen(8080, (error)=> {
  console.log(`Listening port 8080`);
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

function sum(a, b) {
  return a + b;
}

exports.sum = sum;