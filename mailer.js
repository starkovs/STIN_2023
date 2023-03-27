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