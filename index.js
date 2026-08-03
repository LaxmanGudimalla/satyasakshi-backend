const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const reRegistrationRoutes = require("./routes/reRegistration.routes");
const challanRoutes = require("./routes/challan.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const recoveredVehicleRoutes = require("./routes/recoveredVehicle.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const stolenVehicleRoutes = require("./routes/stolenVehicle.routes");
const syncStolenVehicles = require("./cron/syncStolenVehicles");
const syncRecoveredVehicles = require("./cron/syncRecoveredVehicle");
const superAdminRoutes = require("./routes/superAdmin.routes");

//Trigger manual sync on server start.
(async () => {
  console.log("🚀 Manual ZIPNET sync started");

  await syncRecoveredVehicles();
  console.log("✅ Recovered vehicles manual sync finished");
  await syncStolenVehicles();
  console.log("✅ Stolen vehicles manual sync finished");

})();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use("/api", reRegistrationRoutes);
app.use("/api", challanRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", recoveredVehicleRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", stolenVehicleRoutes);
app.use("/api/super-admin", superAdminRoutes);


app.listen(8080, () => {
  console.log("Server running on port 8080");
});
