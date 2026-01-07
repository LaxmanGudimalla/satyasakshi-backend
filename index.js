const express = require("express");
const cors = require("cors");

const reRegistrationRoutes = require("./routes/reRegistration.routes");
const challanRoutes = require("./routes/challan.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const recoveredVehicleRoutes = require("./routes/recoveredVehicle.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", reRegistrationRoutes);
app.use("/api", challanRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", recoveredVehicleRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);


app.listen(8080, () => {
  console.log("Server running on port 8080");
});
