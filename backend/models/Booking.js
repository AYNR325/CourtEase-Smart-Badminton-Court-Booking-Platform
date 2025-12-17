const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    courtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach'
    },
    equipment: [{
        equipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed'
    }
});

module.exports = mongoose.model('Booking', BookingSchema);