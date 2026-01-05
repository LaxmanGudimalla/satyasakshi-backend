const vehicleService = require("../services/vehicle.service");

/**
 * Save Vehicle
 */
exports.saveVehicle = async (req, res) => {
  try {
    if (!req.body || !req.body.data) {
      return res.status(400).json({ message: "Invalid JSON data" });
    }

    const result = await vehicleService.saveVehicle(req.body.data);

    res.json({
      success: true,
      message: "✅ Vehicle data inserted successfully",
      insertedId: result.insertId
    });

  } catch (error) {
    console.error("❌ Insert error:", error.message);
    res.status(500).json({ message: "Database insert failed" });
  }
};


/**
 * Search Vehicle
 */
exports.searchVehicle = async (req, res) => {
  try {
    const {
      registration_number,
      chassis_number,
      engine_number
    } = req.query;

    if (!registration_number && !chassis_number && !engine_number) {
      return res.status(400).json({
        message: "Enter Registration OR Chassis OR Engine Number"
      });
    }

    const data = await vehicleService.searchVehicle(req.query);

    if (!data) {
      return res.json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("❌ Search error:", error.message);
    res.status(500).json({ message: "Database error" });
  }
};
