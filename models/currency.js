const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const currencySchema = new Schema({
  quantity: {
    type: Number, 
    required: true
  },
  code: {
    type: String, 
    unique: true,
    required: true
  },
  rate: {
    type: Number, 
    required: true
  },
  date: {
    type: String, 
    required: true,
    index: true
  }
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;