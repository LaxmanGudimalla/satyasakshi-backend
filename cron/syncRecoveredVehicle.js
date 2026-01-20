//syncRecoveredVehicle.js

const { fetchZipnetData } = require("./zipnetSyncStolenVehicle.cron");
const recoveredService = require("../services/recoveredVehicle.service");
const mapVehicle = require("./mapZipnetRecoveredVehicle");

async function syncRecoveredVehicles() {
  console.log("🔄 Starting full ZIPNET sync...");

  let start = 0;
  const length = 10;
  let totalInserted = 0;

  while (true) {
    console.log(`➡ Fetching records ${start} to ${start + length}...`);

    const vehicles = await fetchZipnetData(start, length);

    if (!vehicles || vehicles.length === 0) {
      console.log("🚫 No more records. Pagination finished.");
      break;
    }

    for (const v of vehicles) {
      const mapped = mapVehicle(v);
      await recoveredService.addOrUpdateRecoveredVehicle(mapped);
      totalInserted++;
    }

    start += length;  // Go to next page
  }

  console.log(`✅ Sync completed. Total inserted/updated: ${totalInserted}`);
}

module.exports = syncRecoveredVehicles;