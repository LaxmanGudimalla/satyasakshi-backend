const express = require("express");
const router = express.Router();
const reRegistrationController = require("../controllers/reRegistration.controller");

router.get("/re-registration", reRegistrationController.getReRegistrationData);

module.exports = router;
