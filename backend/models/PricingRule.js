const mongoose = require('mongoose');

const PricingRuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Percentage', 'Fixed'] },
    value: { type: Number, required: true },
    condition: { type: Object },

});

module.exports = mongoose.model('PricingRule', PricingRuleSchema);