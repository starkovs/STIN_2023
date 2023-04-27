const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
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
    type: String, 
    required: true
  }
});

const Account = mongoose.model('Account', taskSchema);

module.exports = Account;