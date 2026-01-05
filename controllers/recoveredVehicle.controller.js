const recoveredVehicleService = require("../services/recoveredVehicle.service");

exports.addRecoveredVehicle = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.registration_number) {
      return res.status(400).json({
        success: false,
        message: "registration_number is required"
      });
    }

    // 🔍 CHECK DUPLICATE
    const duplicate = await recoveredVehicleService.checkDuplicateRecoveredVehicle({
      registration_number: payload.registration_number,
      engine_number: payload.engine_number,
      chassis_number: payload.chassis_number
    });

    if (duplicate) {
      let errors = {};

      if (
        duplicate.registration_number === payload.registration_number
      ) {
        errors.registration_number = "Registration number already exists";
      }

      if (duplicate.engine_number === payload.engine_number) {
        errors.engine_number = "Engine number already exists";
      }

      if (duplicate.chassis_number === payload.chassis_number) {
        errors.chassis_number = "Chassis number already exists";
      }

      return res.status(409).json({
        success: false,
        message: "Vehicle already exists",
        errors
      });
    }

    // ✅ INSERT IF NO DUPLICATE
    const result = await recoveredVehicleService.addRecoveredVehicle(payload);

    res.status(201).json({
      success: true,
      status: 1,
      message: "Recovered vehicle added successfully",
      data: {
        recoveredVehicleId: result.insertId
      }
    });

  } catch (error) {
    console.error("❌ Recovered Vehicle Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
