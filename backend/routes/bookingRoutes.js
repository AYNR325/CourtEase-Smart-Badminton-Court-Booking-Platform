const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/check-price', bookingController.checkPrice);
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getBookingHistory);

module.exports = router;
