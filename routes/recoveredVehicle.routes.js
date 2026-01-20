
// recoveredVehicles.routesjs

const express = require("express");
const router = express.Router();
const recoveredVehicleController = require("../controllers/recoveredVehicle.controller");
const zipnetSync = require("../cron/zipnetSyncStolenVehicle.cron");
const recoveredService = require("../services/recoveredVehicle.service");
const mapVehicle = require("../cron/mapZipnetRecoveredVehicle");

router.post("/recovered-vehicle", recoveredVehicleController.addRecoveredVehicle);
router.get("/recovered-vehicle",recoveredVehicleController.getRecoveredVehicles);
//To get the data from the ZIPNET
router.get("/sync-recovered", async (req, res) => {
  try {
    let start = 0;
    const length = 10;
    let total = 0;

    while (true) {
      console.log(`➡ Fetching ${start} - ${start + length}`);

      const vehicles = await zipnetSync.fetchZipnetData(start, length);

      if (!vehicles || vehicles.length === 0) {
        console.log("🚫 Pagination finished.");
        break;
      }

      for (const v of vehicles) {
        await recoveredService.addOrUpdateRecoveredVehicle(mapVehicle(v));
        total++;
      }

      start += length; // move to next page
    }

    res.json({
      success: true,
      message: "Full sync completed successfully",
      total_records: total
    });

  } catch (error) {
    console.error("SYNC ERROR:", error);
    res.status(500).json({ success: false, message: "Sync failed" });
  }
});


module.exports = router;





// const express = require("express");
// const router = express.Router();
// const recoveredVehicleController = require("../controllers/recoveredVehicle.controller");

// router.post("/recovered-vehicle", recoveredVehicleController.addRecoveredVehicle);
// router.get("/recovered-vehicle",recoveredVehicleController.getRecoveredVehicles);

// module.exports = router;


