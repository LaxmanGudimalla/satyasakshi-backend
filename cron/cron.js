//cron.js

const cron = require("node-cron");
const syncStolenVehicles = require("./syncStolenVehicles");

// Daily at 2 AM
cron.schedule("0 2 * * *", async () => {
  console.log("⏳ Running daily ZIPNET stolen vehicles sync");
  await syncStolenVehicles();
});

