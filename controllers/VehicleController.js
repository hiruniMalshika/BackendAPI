const Vehicles = require('../models/VehicleModel')

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

const VehicleController = {
    getVehicles: async(req, res)=>{
        try{
            console.log(req.query)
            const features = new APIfeatures(Vehicles.find(), req.query).filtering().sorting().paginating()
            const vehicles= await features.query

            res.json({
                status: 'success',
                result: vehicles.length,
                vehicles: vehicles
            })
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    createVehicle: async(req, res)=>{
        try{
            const {vehicleno, model, vehicletype, fueltype} = req.body;
            

            const vehicle = await Vehicles.findOne({vehicleno})
            if(vehicle)
                return res.status(400).json({msg: "This vehicle already exits. "})

            const newVehicle = new Vehicles({
                vehicleno, model, vehicletype, fueltype
            })
            await newVehicle.save()
            res.json({msg: "Created a Vehicle"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteVehicle: async(req, res)=>{
        try{
            await Vehicles.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Vehicle"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateVehicle: async(req, res)=>{
        try{
            const {vehicleno, model, vehicletype, fueltype} = req.body;
           

            await Vehicles.findOneAndUpdate({_id: req.params.id}, {
                vehicleno, model, vehicletype, fueltype
            })

            res.json({msg: "Updated a Vehicle"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    
}

module.exports = VehicleController;