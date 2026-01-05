const router = require("express").Router();
const challanController = require("../controllers/challan.controller");

router.get("/challans", challanController.getChallans);

module.exports = router;
