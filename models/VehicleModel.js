const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleno:{
        type: String,
        required: true,
        unique: true
    },
    model:{
        type: String,
        required: true,     
    },
    vehicletype: {
        type: String,
        required: true
    },
    fueltype:{
        type: String,
        required: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Vehicles', vehicleSchema);