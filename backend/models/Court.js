const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Indoor', 'Outdoor'], required: true },
    basePricePerHour: { type: Number, required: true }
})

module.exports = mongoose.model('Court', CourtSchema);