const createPath = require('../helpers/create-path');
const User = require('../models/user');
const Account = require('../models/account');
const Payment = require('../models/payment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require("validator");
var nodemailer = require('nodemailer');
const { email, password } = require('../config');

// returns generated access token
const generateAccessToken = (id, username) => {
  const payload = {
    id, 
    username
  }
  return jwt.sign(payload, process.env.SECRET, {expiresIn: "1h"});
}

// get login
const getDashboard = async (req, res) => {
  try {
    const title = 'Dashboard';
    const user = await User.findById(req.userId).exec();
    const accounts = await Account.find({ username: user.id }).sort({ createdAt: -1 }).exec();
    const payments = await Payment.find({ username: user.id }).sort({ createdAt: -1 }).exec();
    res.render(createPath('dashboard'), { payments,accounts, title });
  } catch (error) {
    console.log(error);
    res.render(createPath('error'), { title: 'Error' });
  }
};

const postDashboard = async (req, res) => {
  const {typePayment} = req.body;
  var total = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
  var currencies = ['EUR', 'USD', 'GBP', 'CZK'];
  var currency = currencies[Math.floor(Math.random() * currencies.length)];
  if(typePayment==1){
    // add to database to table payments and balance to accounts

  } else{
    console.log("minus "+total+" "+currency);
  }
  res.redirect('/'); 
}


// get login
const getLogin = (req, res) => {
  res.clearCookie('token');
  const title = 'Login';
  res.render(createPath('login'),{ title });
};

// post login
const postLogin = async (req, res) => {
  const {username, password} = req.body;
  try{
    let user =  await User.findOne({username: username});
    const validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword){
      return res.render(createPath('login'), {title: 'Login', message: 'Login or password is not correct'});
    }
    const token = generateAccessToken(user._id, username);
    res.cookie("token", token, {
      httpOnly: true,
    });
    // redirect to second authorization by email
    return res.redirect('/authentification');   
  } catch(ex){
    return res.render(createPath('login'), {title: 'Login', message: 'Login or password is not correct'});
  }
};

// get Authentification
const getAuthentification = (req, res) => {
  const title = 'Authentification';

  // send email with code
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
  //   subject: 'Code to login',
  //   text: '12345678'
  // };
  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
  res.render(createPath('authentification'),{ title });
};

// post login
const postAuthentification = async (req, res) => {
  // TODO: check token and send email with code
  const {code} = req.body;
  if(code === '12345678'){
    return res.redirect('/'); 
  } else {
    return res.render(createPath('authentification'), {title: 'Authentification', message: 'Code is not correct'});
  }
};

// export all functions
module.exports = {
  getDashboard,
  postDashboard,
  getLogin, 
  postLogin,
  getAuthentification,
  postAuthentification
}