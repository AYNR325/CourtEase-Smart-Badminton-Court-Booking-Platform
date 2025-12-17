const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');

const courts = [
    {
        name: 'Court A',
        type: 'Indoor',
        basePricePerHour: 800
    },
    {
        name: 'Court B',
        type: 'Indoor',
        basePricePerHour: 800
    },
    {
        name: 'Court C',
        type: 'Outdoor',
        basePricePerHour: 500
    },
    {
        name: 'Court D',
        type: 'Outdoor',
        basePricePerHour: 500
    }
];

const equipments = [
    {
        name: 'Yonex Racket',
        type: 'Racket',
        pricePerUnit: 100,
        totalStock: 20
    },
    {
        name: 'Badminton Shoes',
        type: 'Shoe',
        pricePerUnit: 150,
        totalStock: 10
    }
]

const coaches = [
    {
        name: 'Coach Rohit',
        specialization: 'Professional Training',
        hourlyRate: 1000
    },
    {
        name: 'Coach Sneha',
        specialization: 'Basics & Fitness',
        hourlyRate: 700
    },
    {
        name: 'Coach Piyush',
        specialization: 'Strategy & Mental Training',
        hourlyRate: 800
    }
]

const pricingRules = [
    {
        name: 'Peak Hour Surge',
        type: 'Percentage',
        value: 20, // 20% extra
        condition: { startHour: 18, endHour: 21 }
    },
    {
        name: 'Weekend Surcharge',
        type: 'Fixed',
        value: 100, // ₹100 extra flat fee
        condition: { days: [0, 6] } // Saturday (6) and Sunday (0)
    }
]

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected for Seeding...");
        //1. clear existing data
        await Court.deleteMany({});
        await Equipment.deleteMany({});
        await Coach.deleteMany({});
        await PricingRule.deleteMany({});

        //2. Insert new data
        await Court.insertMany(courts);
        await Equipment.insertMany(equipments);
        await Coach.insertMany(coaches);
        await PricingRule.insertMany(pricingRules);

        console.log("Database Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding Failed: ", error);
        process.exit(1);
    }
}

seedDatabase();
