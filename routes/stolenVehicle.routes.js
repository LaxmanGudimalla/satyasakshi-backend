// routes/stolenVehicle.routes.js

const express = require("express");
const router = express.Router();
const stolenVehicleController = require("../controllers/stolenVehicle.controller");

// 🔍 Search stolen vehicles (ZIPNET data)
router.get("/stolen-vehicles", stolenVehicleController.getStolenVehicles);
router.post("/customer-stolen-vehicle", stolenVehicleController.addCustomerStolenVehicle);


module.exports = router;
