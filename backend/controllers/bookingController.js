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
    const { courtId, startTime, endTime, equipmentList, coachId, userId } = req.body;
    if (!courtId || !startTime || !endTime) {
        return res.status(400).json({ message: "required details are not found" });
    }
    try {
        //check whether existing booking is there
        const start = new Date(startTime);
        const end = new Date(endTime);
        const conflict = await Booking.findOne({
            courtId: courtId,
            status: { $ne: 'Cancelled' },//ignore cancelled bookings
            $or: [
                {
                    startTime: { $lt: end },
                    endTime: { $gt: start }
                }
            ]
        })
        if (conflict) {
            return res.status(400).json({ message: "Court is already booked for this slot." })
        }
        //calculate final price
        const totalPrice = await calculateTotalPrice(courtId, startTime, endTime, equipmentList, coachId);
        //create and save booking
        const newBooking = new Booking({
            courtId,
            userId,
            startTime: start,
            endTime: end,
            equipment: equipmentList || [],//default empty array if none provided
            coachId: coachId || null, //defalut to null if no coach
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

module.exports = { checkPrice, createBooking };