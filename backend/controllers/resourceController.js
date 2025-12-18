const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');

//To get all courts
const getAllCourts = async (req, res) => {
    try {
        const courts = await Court.find();
        if (!courts) {
            return res.status(404).json({ message: "courts not found" });
        }
        res.status(200).json({ courts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
//To get all equipments
const getAllEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find();
        if (!equipments) {
            return res.status(404).json({ message: "equipments not found" });
        }
        res.status(200).json({ equipments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
//To get all coaches
const getAllCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find();
        if (!coaches) {
            return res.status(404).json({ message: "coaches not found" });
        }
        res.status(200).json({ coaches });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// --- Admin Operations ---

// Add new Court
const addCourt = async (req, res) => {
    try {
        const newCourt = new Court(req.body);
        await newCourt.save();
        res.status(201).json({ message: "Court added successfully", court: newCourt });
    } catch (error) {
        res.status(500).json({ message: "Failed to add court", error: error.message });
    }
}

// Delete Court
const deleteCourt = async (req, res) => {
    try {
        await Court.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Court deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete court", error: error.message });
    }
}

// Add new Equipment
const addEquipment = async (req, res) => {
    try {
        const newEquipment = new Equipment(req.body);
        await newEquipment.save();
        res.status(201).json({ message: "Equipment added successfully", equipment: newEquipment });
    } catch (error) {
        res.status(500).json({ message: "Failed to add equipment", error: error.message });
    }
}

// Delete Equipment
const deleteEquipment = async (req, res) => {
    try {
        await Equipment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete equipment", error: error.message });
    }
}

// Add new Coach
const addCoach = async (req, res) => {
    try {
        const newCoach = new Coach(req.body);
        await newCoach.save();
        res.status(201).json({ message: "Coach added successfully", coach: newCoach });
    } catch (error) {
        res.status(500).json({ message: "Failed to add coach", error: error.message });
    }
}

// Delete Coach
const deleteCoach = async (req, res) => {
    try {
        await Coach.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Coach deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete coach", error: error.message });
    }
}

module.exports = {
    getAllCoaches, getAllCourts, getAllEquipments,
    addCourt, deleteCourt,
    addEquipment, deleteEquipment,
    addCoach, deleteCoach
};