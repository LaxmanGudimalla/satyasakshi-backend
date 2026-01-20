// routes/stolenVehicle.routes.js

const express = require("express");
const router = express.Router();
const stolenVehicleController = require("../controllers/stolenVehicle.controller");

// 🔍 Search stolen vehicles (ZIPNET data)
router.get("/stolen-vehicles", stolenVehicleController.getStolenVehicles);

module.exports = router;
