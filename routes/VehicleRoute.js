const router = require('express').Router()
const VehicleController = require('../controllers/VehicleController')

router.route('/vehicles')
    .get(VehicleController.getVehicles)
    .post(VehicleController.createVehicle)

router.route('/vehicles/:id')
    .delete(VehicleController.deleteVehicle)
    .put(VehicleController.updateVehicle)



module.exports = router