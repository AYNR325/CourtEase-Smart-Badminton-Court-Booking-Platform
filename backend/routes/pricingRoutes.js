const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

router.get('/', pricingController.getAllRules);
router.post('/', pricingController.addRule);
router.delete('/:id', pricingController.deleteRule);

module.exports = router;
