const express = require('express');
const router = express.Router();
const resourceContoller = require('../controllers/resourceController');

router.get('/courts', resourceContoller.getAllCourts);
router.post('/courts', resourceContoller.addCourt);
router.delete('/courts/:id', resourceContoller.deleteCourt);

router.get('/equipments', resourceContoller.getAllEquipments);
router.post('/equipments', resourceContoller.addEquipment);
router.delete('/equipments/:id', resourceContoller.deleteEquipment);

router.get('/coaches', resourceContoller.getAllCoaches);
router.post('/coaches', resourceContoller.addCoach);
router.delete('/coaches/:id', resourceContoller.deleteCoach);

module.exports = router;