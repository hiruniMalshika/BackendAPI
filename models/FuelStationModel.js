const mongoose = require('mongoose')

const fuelStationSchema = new mongoose.Schema({
    stationname:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    location:{
        type: String,
        trim: true,
        required: true
    },
    petrolamount:{
        type: Number,
        required: true
    },
    dieselamount:{
        type: Number,
        required: true
    },
    petrolqueue:{
        type: Number,
        required: true
    },
    dieselqueue:{
        type: Number,
        required: true
    }

},{
    timestamps:true//important
})

module.exports = mongoose.model("fuelstations", fuelStationSchema)