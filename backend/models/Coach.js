const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String },
    hourlyRate: { type: Number, required: true },
});

module.exports = mongoose.model('Coach', CoachSchema);