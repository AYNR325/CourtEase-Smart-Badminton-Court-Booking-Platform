const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Racket', 'Shoe'], required: true },
    pricePerUnit: { type: Number, required: true },
    totalStock: { type: Number, required: true },
});

module.exports = mongoose.model('Equipment', EquipmentSchema);