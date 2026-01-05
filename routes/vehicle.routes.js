const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");

router.post("/save-vehicle", vehicleController.saveVehicle);
router.get("/search-vehicle", vehicleController.searchVehicle);

module.exports = router;
