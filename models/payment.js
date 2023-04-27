const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  account: {
    type: String, 
    required: true
  },
  total: {
    type: String, 
    required: true
  },
  username: {
    type: String, 
    required: true
  },
  currency: {
    type: String, 
    required: true
  },
  currencyRate: {
    type: String, 
    required: true
  },
  type: {
    type: String, 
    required: true
  },
  date: {
    type: Date, 
    required: true
  }
});

const Payment = mongoose.model('Payment', taskSchema);

module.exports = Payment;