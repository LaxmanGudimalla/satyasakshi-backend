const express = require("express");
const router = express.Router();
const drivingLicenceController = require("../controllers/drivingLicence.controller");

router.get("/driving-licence", drivingLicenceController.getDrivingLicence);

module.exports = router;
