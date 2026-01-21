const fetchZipnetRecoveredData = require("./zipnetSyncRecoveredVehicle.cron");
const mapVehicle = require("./mapZipnetRecoveredVehicle");
const recoveredService = require("../services/recoveredVehicle.service");

const MAX_RECORDS_TO_CHECK = 10000;

async function syncRecoveredVehicles() {
  console.log("🚓 ZIPNET → recovered_vehicles sync started");

  let start = 0;
  const length = 100;
  let total = 0;

  while (true) {
    if (start >= MAX_RECORDS_TO_CHECK) break;

    const rows = await fetchZipnetRecoveredData(start, length);
    if (!rows.length) break;

    for (const r of rows) {
      const payload = mapVehicle(r);
      await recoveredService.addOrUpdateRecoveredVehicle(payload);
      total++;
    }

    start += length;
  }

  console.log(`✅ Recovered vehicles sync complete: ${total}`);
}

module.exports = syncRecoveredVehicles;
