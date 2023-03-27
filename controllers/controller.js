const createPath = require('../helpers/create-path');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require("validator");
var nodemailer = require('nodemailer');
const { email, password } = require('../config');

// get login
const getUser = (req, res) => {
  const title = 'User';
  res.render(createPath('user'),{ title });
};

// get login
const getLogin = (req, res) => {
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
    // const token = generateAccessToken(user._id, username);
    // res.cookie("token", token, {
    //   httpOnly: true,
    // });
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
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
  });

  var mailOptions = {
    from: email,
    to: 'mikhail.starkov@tul.cz',
    subject: 'Code to login',
    text: '12345678'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.render(createPath('authentification'),{ title });
};

// post login
const postAuthentification = async (req, res) => {
  // TODO: check token and send email with code
  const {code} = req.body;
  if(code === '12345678'){
    console.log("success");
  }
};

// export all functions
module.exports = {
  getUser,
  getLogin, 
  postLogin,
  getAuthentification,
  postAuthentification
}