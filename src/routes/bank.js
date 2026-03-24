const express = require('express');
const { getAccount, deposit } = require('../controllers/bankController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get('/account', getAccount);
router.put('/deposit', deposit);

module.exports = router;
