const express = require("express");
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const { 
  getLogin,
  postLogin,
  getAuthentification,
  postAuthentification,
  getDashboard,
  postDashboard
} = require('../controllers/controller');


router.get('/', authMiddleware, getDashboard);
router.post('/', authMiddleware, postDashboard);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/authentification', authMiddleware, getAuthentification);
router.post('/authentification', authMiddleware, postAuthentification);

module.exports = router;