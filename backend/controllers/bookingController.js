const calculateTotalPrice = require("../utils/priceCalculator");
const Booking = require("../models/Booking");

//to check price
const checkPrice = async (req, res) => {
    const { courtId, startTime, endTime, equipmentList, coachId } = req.body;
    if (!courtId || !startTime || !endTime) {
        return res.status(400).json({ message: "required details are not found" });
    }
    try {
        const price = await calculateTotalPrice(courtId, startTime, endTime, equipmentList, coachId);
        if (!price) {
            return res.status(400).json({ message: "price not found" });
        }
        res.status(200).json({ price });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
    }
}

//to create booking
const createBooking = async (req, res) => {
    // 1. Destructure name/email instead of userId
    const { courtId, startTime, endTime, equipmentList, coachId, name, email } = req.body;

    if (!courtId || !startTime || !endTime || !name || !email) {
        return res.status(400).json({ message: "Missing required fields (Name or Email)" });
    }

    try {
        const User = require('../models/User'); // Import if not at top

        // 2. Resolve User (Find or Create)
        let user = await User.findOne({ email });
        if (!user) {
            // Create new user on the fly
            user = new User({
                name,
                email,
                role: 'User',
                password: 'temp_password' // In real app, they would set this later
            });
            await user.save();
        }

        // 3. Check for Overlap
        const start = new Date(startTime);
        const end = new Date(endTime);
        const conflict = await Booking.findOne({
            courtId: courtId,
            status: { $ne: 'Cancelled' },
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        })
        if (conflict) {
            return res.status(400).json({ message: "Court is already booked for this slot." })
        }

        // 4. Calculate Final Price
        const totalPrice = await calculateTotalPrice(courtId, startTime, endTime, equipmentList, coachId);

        // 5. Create Booking using resolved user._id
        const newBooking = new Booking({
            courtId,
            userId: user._id,
            startTime: start,
            endTime: end,
            equipment: equipmentList || [],
            coachId: coachId || null,
            totalPrice,
            status: 'Confirmed'
        });
        await newBooking.save();

        res.status(200).json({
            message: "Booking Confirmed",
            booking: newBooking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
    }
}

// Get Booking History by Email
const getBookingHistory = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const User = require('../models/User');
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find bookings for this user
        // Populate 'courtId' to get court details (name, type)
        const bookings = await Booking.find({ userId: user._id })
            .populate('courtId', 'name type')
            .sort({ startTime: -1 }); // Newest first

        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { checkPrice, createBooking, getBookingHistory };