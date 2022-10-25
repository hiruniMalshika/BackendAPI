const router = require('express').Router()
const FuelStationController = require('../controllers/FuelStationController')
const authStationOwner = require('../middleware/authStationOwner')


router.route('/fuelstations')
    .get(FuelStationController.getFuelStations)
    .post(FuelStationController.createFuelStation)

router.route('/fuelstations/:id')
    .delete(FuelStationController.deleteFuelStation)
    .put(authStationOwner, FuelStationController.updateFuelStation)



module.exports = router