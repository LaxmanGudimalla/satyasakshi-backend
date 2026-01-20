const { fetchZipnetData } = require("./zipnetSyncStolenVehicle.cron");
const mapZipnetStolenVehicle = require("./mapZipnetStolenVehicle");
const stolenService = require("../services/stolenVehicle.service");

const MAX_RECORDS_TO_CHECK = 10000;

async function syncStolenVehicles() {
  console.log("🚓 ZIPNET → stolen_vehicles sync started");

  let start = 0;
  const length = 100; // increase for speed
  let total = 0;

  while (true) {
  // ✅ Stop after checking 10,000 records
    if (start >= MAX_RECORDS_TO_CHECK) {
      console.log(`🛑 Stopped after checking ${MAX_RECORDS_TO_CHECK} records`);
      break;
    }

    const vehicles = await fetchZipnetData(start, length);

    if (!vehicles || vehicles.length === 0) {
      console.log("✅ No more ZIPNET records");
      break;
    }

    for (const v of vehicles) {
      const payload = mapZipnetStolenVehicle(v);
      await stolenService.addOrUpdateStolenVehicle(payload);
      total++;
    }

    start += length;
  }

  console.log(`✅ Stolen vehicles sync complete: ${total}`);
}

module.exports = syncStolenVehicles;
