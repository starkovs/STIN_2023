const createPath = require('../helpers/create-path');
const User = require('../models/user');
const Account = require('../models/account');
const Payment = require('../models/payment');
const Currency = require('../models/currency');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require("validator");
var nodemailer = require('nodemailer'); 
const { email, password } = require('../config');
const axios = require('axios');
const Holidays = require('date-holidays');
const { isWeekend } = require('date-fns');

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
  updateCurrencyRates(new Date());
  const {typePayment} = req.body;
  // random number from 1 to 1000
  var total = Math.floor(Math.random() * (1000 - 1 + 1) + 1);

  // names of currencies from database table currencies
  var currencies = await Currency.find({});
  
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
    if (account_detail.length != 0){
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
      payment.currencyRate = currency_rate[0].rate/currency_rate[0].quantity;
      payment.account = account_detail[0].number;
      // payment.account_currency = account_detail[0].currency;
      payment.total = (parseFloat(total)*parseFloat(payment.currencyRate)).toFixed(2).toString();
      payment.currency = "CZK";
    }

    // add to database to table payments and balance to accounts
    await Payment.create(payment);
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
    if (account_detail.length != 0 && account_detail.balance >= (currency.rate / currency.quantity)){  
      payment.account = account_detail[0].number;
      payment.currencyRate = "1";
      payment.total = (currency.rate / currency.quantity);
      payment.account_currency = random_currency;
      payment.currency = random_currency;
      await Payment.create(payment);
      // update account.balance
      // await Account.updateOne({ username: req.userId, currency: random_currency }, { $inc: { balance: -payment.total } });
    } else{
      // get CZK account and convert to CZK
      var account_detail = await Account.find({ username: req.userId, currency: "CZK"});
      const currency = await Currency.findOne({ code: random_currency });
      const czkTotal = total * (currency.rate / currency.quantity);
      if (account_detail.balance < czkTotal) {
        return res.render(createPath('dashboard'), { title: 'Dashboard', message: 'Not enough money to provide payment on your account' });
      }
      payment.currencyRate = currency.rate/currency.quantity;
      payment.account = account_detail[0].number;
      payment.account_currency = account_detail[0].currency;
      payment.total = czkTotal;
      payment.currency = "CZK";
      await Payment.create(payment);
      // update account.balance
      // await Account.updateOne({ username: req.userId, currency: 'CZK' }, { $inc: { balance: parseFloat(-czkTotal) } });
      console.log("minus "+total+" "+currency+" (CZK - "+czkTotal+")");
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

function parseCurrencyRates(data) {
  const lines = data.split("\n");
  const dateMatch = lines[0].match(/\d+\.\d+\.\d+/);
  // const date = dateMatch ? new Date(dateMatch[0]) : null;
  const date = dateMatch[0]
  const rates = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      continue;
    }

    const rate = parseLine(line);

    if (rate) {
      rates.push(rate);
    }
  }

  return {
    date,
    rates,
  };
}

function parseLine(line) {
  const [country, currency, quantity, code, rate] = line.split("|");

  if (rate === undefined) {
    return null;
  }

  return {
    quantity: parseInt(quantity),
    code,
    rate: parseFloat(rate.replace(',', '.')),
  };
}

async function updateCurrencyRates() {
  const today = new Date();
  const isWeekendToday = isWeekend(today);
  const holidays = new Holidays('cz');
  const isHoliday = holidays.isHoliday(today);
  const lastRate = await Currency.findOne().sort({ date: -1 }).exec();
  const [day, month, year] = lastRate.date.split('.');
  const formatDate = `${year}-${month}-${day}`;  

  if (lastRate && new Date(formatDate).getTime() === today.getTime()) {
    console.log(`Rates already updated for ${today}`);
    return;
  }

  // If today is a weekend or holiday, do not update currency rates
  if (isWeekendToday || isHoliday) {
    console.log('Today is a weekend or holiday, currency rates will not be updated');
    return;
  }

  const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

  try {
    const response = await axios.get(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=${formattedDate}`);
    const { date: parsedDate, rates } = parseCurrencyRates(response.data);

    if (rates.length === 0) {
      console.log(`No currency rates available for ${parsedDate}`);
      return;
    }

    const updatedRates = rates.slice(1);
    // console.log(updatedRates);

    await Currency.deleteMany({}); // delete all existing currencies

    const currencies = updatedRates.map(rate => ({
      ...rate,
      date: parsedDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    // console.log(currencies);
    await Currency.create(currencies); // insert new currencies
    console.log(`Saved ${currencies.length} currency rates for ${parsedDate}`);

  } catch (err) {
    console.error(`Error updating currency rates: ${err}`);
  }

}

// export all functions
module.exports = {
  getDashboard,
  postDashboard,
  getLogin, 
  postLogin,
  getAuthentification,
  postAuthentification
}