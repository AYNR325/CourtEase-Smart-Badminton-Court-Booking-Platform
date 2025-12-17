const express = require('express');
const router = express.Router();
const resourceContoller = require('../controllers/resourceController');

router.get('/courts', resourceContoller.getAllCourts);
router.get('/equipments', resourceContoller.getAllEquipments);
router.get('/coaches', resourceContoller.getAllCoaches);

module.exports = router;