const createPath = require('../helpers/create-path');

// get login
const getLogin = (req, res) => {
  const title = 'Login';
  res.render(createPath('login'),{ title });
};

// post login
const postLogin = async (req, res) => {
  // TODO
};

// export all functions
module.exports = {
  getLogin, 
  postLogin
}