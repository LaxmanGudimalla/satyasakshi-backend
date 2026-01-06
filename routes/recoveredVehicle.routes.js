const express = require("express");
const router = express.Router();
const recoveredVehicleController = require("../controllers/recoveredVehicle.controller");

router.post("/recovered-vehicle", recoveredVehicleController.addRecoveredVehicle);
router.get("/recovered-vehicle",recoveredVehicleController.getRecoveredVehicles);

module.exports = router;
