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

module.exports = { getAllCoaches, getAllCourts, getAllEquipments };