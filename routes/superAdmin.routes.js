const express = require("express");
const router = express.Router();
const controller = require("../controllers/superAdmin.controller");

/* Pending */
router.get("/pending-recovered", controller.getPendingRecovered);
router.get("/pending-stolen", controller.getPendingStolen);

/* Approve */
router.post("/approve-recovered/:id", controller.approveRecovered);
router.post("/approve-stolen/:id", controller.approveStolen);

/* Reject */
router.delete("/reject-recovered/:id", controller.rejectRecovered);
router.delete("/reject-stolen/:id", controller.rejectStolen);

module.exports = router;
