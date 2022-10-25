const Fuelstations = require('../models/FuelStationModel')

class APIfeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        
        const excludedfields = ['page', 'sort', 'limit']
        excludedfields.forEach(el => delete(queryObj[el]))
        
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match=> '$' + match)

        this.query.find(JSON.parse(queryStr))

        return this;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page -1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const FuelStationController = {
    getFuelStations: async(req, res)=>{
        try{
            console.log(req.query)
            const features = new APIfeatures(Fuelstations.find(), req.query).filtering().sorting().paginating()
            const fuelstations= await features.query

            res.json({
                status: 'success',
                result: fuelstations.length,
                fuelstations: fuelstations
            })
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    createFuelStation: async(req, res)=>{
        try{
            const {stationname, location, petrolamount, dieselamount, petrolqueue, dieselqueue} = req.body;
            

            const station = await Fuelstations.findOne({stationname})
            if(station)
                return res.status(400).json({msg: "This station already exits. "})

            const newStation = new Fuelstations({
                stationname, location, petrolamount, dieselamount, petrolqueue, dieselqueue
            })
            await newStation.save()
            res.json({msg: "Created a Fuel Station"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteFuelStation: async(req, res)=>{
        try{
            await Fuelstations.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Fuel Station"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateFuelStation: async(req, res)=>{
        try{
            const {stationname, location, petrolamount, dieselamount, petrolqueue, dieselqueue} = req.body;
           

            await Fuelstations.findOneAndUpdate({_id: req.params.id}, {
                stationname, location, petrolamount, dieselamount, petrolqueue, dieselqueue
            })

            res.json({msg: "Updated a Fuel Station"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    updatePetrolQueue: async (req, res) =>{
        try{
            const station = await Fuelstations.findById(req.params.id);
            if(!station) return res.status(400).json({msg: "Station does not exist."})

            await Fuelstations.findOneAndUpdate({_id: req.params.id}, {
                petrolqueue: req.body.petrolqueue
            })
            
            return res.json({msg: "Updated Petrol Queue"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateDieselQueue: async (req, res) =>{
        try{
            const station = await Fuelstations.findById(req.params.id);
            if(!station) return res.status(400).json({msg: "Station does not exist."})

            await Fuelstations.findOneAndUpdate({_id: req.params.id}, {
                dieselqueue: req.body.dieselqueue
            })
            
            return res.json({msg: "Updated Diesel Queue"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    
}

module.exports = FuelStationController;