const jwt = require('jsonwebtoken');

// returns generated access token
const generateAccessToken = (id, username) => {
  const payload = {
    id, 
    username
  }
  return jwt.sign(payload, process.env.SECRET, {expiresIn: "1h"});
}

module.exports = {
  generateAccessToken
}
