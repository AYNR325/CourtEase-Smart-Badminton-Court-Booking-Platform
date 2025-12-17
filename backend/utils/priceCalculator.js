const Coach = require("../models/Coach");
const Court = require("../models/Court");
const Equipment = require("../models/Equipment");
const PricingRule = require("../models/PricingRule");

const calculateTotalPrice = async (courtId, startTime, endTime, equipmentList = [], coachId = null) => {

    try {
        let totalPrice = 0;
        const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
        //court cost
        const court = await Court.findById(courtId);
        const baseCost = court.basePricePerHour * hours;
        totalPrice += baseCost;
        //coach cost
        if (coachId) {
            const coach = await Coach.findById(coachId);
            const coachCost = coach.hourlyRate * hours;
            totalPrice += coachCost;
        }
        //equipment cost
        if (equipmentList && equipmentList.length > 0) {
            for (const item of equipmentList) {
                const equip = await Equipment.findById(item.equipmentId);
                if (equip) {
                    totalPrice += equip.pricePerUnit * item.quantity;
                }
            }
        }
        //apply pricing rules
        const activeRules = await PricingRule.find();
        const start = new Date(startTime);
        const day = start.getDay(); //0=sun,6=sat
        const hour = start.getHours();

        for (const rule of activeRules) {
            let applies = false;
            //check Day condition(weekend)
            if (rule.condition.days && rule.condition.days.includes(day)) {
                applies = true;
            }
            //check Time condition(peak hours between 6 pm to 9 pm)
            if (rule.condition.startHour && rule.condition.endHour) {
                if (hour >= rule.condition.startHour && hour < rule.condition.endHour) {
                    applies = true;
                }
            }

            if (applies) {
                if (rule.type === 'Percentage') {
                    // Check if rule.value is 20 (meaning 20%) or 0.2
                    // Assuming 20 from our seed data:
                    totalPrice += (totalPrice * rule.value / 100);
                } else if (rule.type === 'Fixed') {
                    totalPrice += rule.value;
                }
            }
        }

        return Math.round(totalPrice);
    } catch (error) {
        console.error(error);
    }
}

module.exports = calculateTotalPrice;


