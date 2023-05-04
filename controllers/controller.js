const createPath = require('../helpers/create-path');
const User = require('../models/user');
const Account = require('../models/account');
const Payment = require('../models/payment');
const Currency = require('../models/currency');
const bcrypt = require('bcryptjs');
const validator = require("validator");
var nodemailer = require('nodemailer'); 
const { email, password } = require('../config');
const { updateCurrencyRates } = require('../helpers/currency');
const { generateAccessToken } = require('../helpers/auth');

var codeEntry = '';

// get login
const getDashboard = async (req, res) => {
  try {
    const message = req.message;
    const title = 'Dashboard';
    const user = await User.findById(req.userId).exec();
    const accounts = await Account.find({ username: user.id });
    const payments = await Payment.find({ username: user.id });
    res.render(createPath('dashboard'), { payments,accounts, title, message });
  } catch (error) {
    console.error(error);
    res.render(createPath('error'), { title: 'Error' });
  }
};


const postDashboard = async (req, res) => {
  updateCurrencyRates(new Date());
  const {typePayment} = req.body;
  // random number from 1 to 1000
  var total = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
  // names of currencies from database table currencies
  var currencies = await Currency.find({});
  if(currencies.length==0){
    // redirect get dashboard
    req.message = 'No currencies in database';
    return res.redirect('/');
  }
  
  var currencies_name = currencies.map(function(item) {
    return item.code;
  });

  // random currency
  var random_currency = currencies_name[Math.floor(Math.random() * currencies_name.length)];


  console.log(total+" "+random_currency);

  // INCOME
  if(typePayment==1){
    // get account number of this client and currency
    var account_detail = await Account.find({ username: req.userId, currency: random_currency});

    var payment = {
      username: req.userId,
      type: "income", 
      date: new Date(),
    }

    // if user has account in this currency - add money to this account
    if (account_detail && account_detail.length != 0){
      payment.account = account_detail[0].number;
      payment.currencyRate = "1";
      payment.total = total;
      // payment.account_currency = random_currency;
      payment.currency = random_currency;
    } else{
      // convert to CZK and add to CZK account
      var account_detail = await Account.find({ username: req.userId, currency: "CZK"});
       // download actual currency rate
      var currency_rate = await Currency.find({code: random_currency});
      if(currency_rate && currency_rate[0].rate!=null && currency_rate[0].quantity!=null){
        payment.currencyRate = (parseFloat(currency_rate[0].rate)/parseFloat(currency_rate[0].quantity));
        payment.account = account_detail[0].number;
        // payment.account_currency = account_detail[0].currency;
        payment.total = (parseFloat(total)*parseFloat(payment.currencyRate));
        payment.currency = "CZK";
      }
    }

    // add to database to table payments and balance to accounts
    await Payment.create(payment);
    await Account.updateOne({ username: req.userId, currency: payment.currency }, { $inc: { balance: payment.total } });
    console.log("plus "+total+" "+random_currency);
  } else{
    // OUTCOME

    var payment = {
      username: req.userId,
      type: "outcome", 
      date: new Date(),
    }
    var account_detail = await Account.find({ username: req.userId, currency: random_currency });
    const currency = await Currency.findOne({ code: random_currency });
    // if account exists in this currency
    if (account_detail.length != 0 && account_detail[0].balance >= total){  
      payment.account = account_detail[0].number;
      payment.currencyRate = "1";
      payment.total = total;
      payment.account_currency = random_currency;
      payment.currency = random_currency;
      await Payment.create(payment);
      // update account.balance
      await Account.updateOne({ username: req.userId, currency: random_currency }, { $inc: { balance: -payment.total } });
    } else{
      // get CZK account and convert to CZK
      var account_detail = await Account.find({ username: req.userId, currency: "CZK"});
      const czkTotal = (total * parseFloat(currency.rate)/parseFloat(currency.quantity));
      console.log(czkTotal);
      console.log(account_detail);
      if (account_detail && account_detail[0].balance < czkTotal) {
        const accounts = await Account.find({ username: req.userId });
        const payments = await Payment.find({ username: req.userId });
        return res.render(createPath('dashboard'), { payments,accounts,title: 'Dashboard', message: 'Not enough money to provide payment on your account' });
      } else
      payment.currencyRate = (parseFloat(currency.rate)/parseFloat(currency.quantity));
      payment.account = account_detail[0].number;
      payment.account_currency = account_detail[0].currency;
      payment.total = czkTotal;
      payment.currency = "CZK";
      await Payment.create(payment);
      // update account.balance
      await Account.updateOne({ username: req.userId, currency: 'CZK' }, { $inc: { balance: parseFloat(-czkTotal) } });
      console.log("minus "+total+" "+random_currency+" (CZK - "+czkTotal+")");
    }
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
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
  });

  codeEntry = Math.floor(100000 + Math.random() * 900000).toString();
  // codeEntry = '12345678';

  var mailOptions = {
    from: email,
    to: 'mikhail.starkov@tul.cz',
    subject: 'Code to login',
    text: codeEntry
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
  const {code} = req.body;
  if(code === codeEntry){
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
  postAuthentification,
  codeEntry
}