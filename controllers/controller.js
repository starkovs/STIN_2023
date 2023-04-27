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
    const accounts = await Account.find({ username: user.id });
    const payments = await Payment.find({ username: user.id });
    res.render(createPath('dashboard'), { payments,accounts, title });
  } catch (error) {
    console.log(error);
    res.render(createPath('error'), { title: 'Error' });
  }
};

const postDashboard = async (req, res) => {
  const {typePayment} = req.body;
  // random number from 1 to 1000
  var total = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
  var currencies = ['EUR', 'USD', 'GBP', 'CZK'];
  // random currency
  var random_currency = currencies[Math.floor(Math.random() * currencies.length)];
  console.log(random_currency);
  if(typePayment==1){
    // get account number of this client and currency
    const account_detail = await Account.find({ username: req.userId, currency: 'EUR'});

    var payment = {
      account: account_detail[0].number, 
      total: total, 
      username: req.userId,
      type: "income", 
      date: new Date(),
    }

    // if user has account in this currency - add money to this account
    if (account_detail.length != 0){
      payment.currencyRate = 1;
      payment.currency = random_currency;
    } else{
      // download actual currency rate
      
      // convert to CZK and add to CZK account
      payment.currency = "CZK";
    }

    // add to database to table payments and balance to accounts
    await Payment.create(payment);
    console.log("plus "+total+" "+random_currency);
  } else{
    // control if account in this currency has enough money

    // pokud ano -> odečíst z účtu a přidat do tabulky payments

    // pokud ne -> control if account in CZK currency has enough money

    // pokuad ano -> odečíst z CZK účtu podle aktualniho kurzu a přidat do tabulky payments

    // pokud ne -> Vypis error, ze nedostatek peněz na účtu pro provedeni platby
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