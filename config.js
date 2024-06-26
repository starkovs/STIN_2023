const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  mongo_url: process.env.MONGO_URL
};

