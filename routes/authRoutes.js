const express = require('express');
const router = express.Router();

const { registerStudent, loginUser } = require('../controllers/authcontroller');
const auth = require('../middleware/auth');

router.post('/register', registerStudent);
router.post('/login', loginUser);

module.exports = router;
