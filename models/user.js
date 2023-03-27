const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  username: {
    type: String, 
    unique: true,
    required: true
  },
  password: {
    type: String, 
    required: true
  }
});

const User = mongoose.model('User', taskSchema);

module.exports = User;