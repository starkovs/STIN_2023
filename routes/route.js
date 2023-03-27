const express = require("express");
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const { 
  getLogin,
  postLogin,
  getAuthentification,
  postAuthentification,
  getUser
} = require('../controllers/controller');


router.get('/', authMiddleware, getUser);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/authentification', getAuthentification);
router.post('/authentification', postAuthentification);

module.exports = router;