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

exports.getRecoveredVehicles = async (req, res) => {
  try {
    const {
      registration_number,
      chassis_number,
      engine_number,

      chassis6,
      engine6,
      reg_last4,

      engine_or_chassis_last5,
      engine_or_chassis_last6
    } = req.query;

    // ❌ No search criteria
    if (
      !registration_number &&
      !chassis_number &&
      !engine_number &&
      !chassis6 &&
      !engine6 &&
      !reg_last4 &&
      !engine_or_chassis_last5 &&
      !engine_or_chassis_last6
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one search field is required"
      });
    }

    const data = await recoveredVehicleService.getRecoveredVehicles({
      registration_number,
      chassis_number,
      engine_number,

      chassis_first6_reg_last4:
        chassis6 && reg_last4
          ? { chassis6, regLast4: reg_last4 }
          : null,

      engine_first6_reg_last4:
        engine6 && reg_last4
          ? { engine6, regLast4: reg_last4 }
          : null,

      engine_or_chassis_last5,
      engine_or_chassis_last6
    });

    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      status: 1,
      data
    });

  } catch (error) {
    console.error("❌ Get Recovered Vehicle Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};