const express = require("express");
const router = express.Router();

const { 
  getLogin,
  postLogin
} = require('../controllers/controller');

router.get('/login', getLogin);

module.exports = router;