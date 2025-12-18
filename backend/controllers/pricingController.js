const PricingRule = require('../models/PricingRule');

// Get all rules
const getAllRules = async (req, res) => {
    try {
        const rules = await PricingRule.find();
        res.status(200).json({ rules });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch rules", error: error.message });
    }
}

// Add new Rule
const addRule = async (req, res) => {
    try {
        const newRule = new PricingRule(req.body);
        await newRule.save();
        res.status(201).json({ message: "Rule added successfully", rule: newRule });
    } catch (error) {
        res.status(500).json({ message: "Failed to add rule", error: error.message });
    }
}

// Delete Rule
const deleteRule = async (req, res) => {
    try {
        await PricingRule.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Rule deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete rule", error: error.message });
    }
}

module.exports = { getAllRules, addRule, deleteRule };
