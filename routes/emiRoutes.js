const express = require('express');
const router = express.Router();
const emiController = require('../controllers/emiController');

router.post('/calculate-emi', emiController.calculateEmi);
router.get('/emis', emiController.getAllEmis);
router.get('/emi/:id', emiController.getEmiById);

module.exports = router;