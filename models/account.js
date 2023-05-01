const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: {
    type: String, 
    required: true
  },
  number: {
    type: String, 
    unique: true,
    required: true
  },
  currency: {
    type: String, 
    required: true
  },
  balance: {
    type: Number, 
    required: true
  }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;