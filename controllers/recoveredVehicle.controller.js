const recoveredVehicleService = require("../services/recoveredVehicle.service");

//for customer adding the recoverd vehicle
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
  message:
    duplicate.source === "official"
      ? "Vehicle already exists in official records"
      : "Vehicle already submitted by another customer",
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

    /* =====================================
       🔥 COMMON SEARCH (ISOLATED & FIRST)
       ===================================== */
    if (req.query.commonSearch) {
      const v = req.query.commonSearch.trim().toUpperCase();

      const data =
        await recoveredVehicleService.commonSearchRecoveredVehicles(v);

      if (!data.length) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found"
        });
      }

      return res.status(200).json({
        success: true,
        status: 1,
        data
      });
    }

    const {
      registration_number,
      chassis_number,
      engine_number,
      chassis6_reg4,
       engine6_reg4, 
      engine_or_chassis_last5,
      engine_or_chassis_last6
    } = req.query;
    if (
      !registration_number &&
      !chassis_number &&
      !engine_number &&
      !chassis6_reg4 &&
!engine6_reg4 &&

      !engine_or_chassis_last5 &&
      !engine_or_chassis_last6
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one search field is required"
      });
    }

    let filters = {};

    // ✅ ONLY ONE SEARCH RULE ALLOWED
    if (chassis6_reg4) {
      if (chassis6_reg4.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "Enter 6 chassis + 4 registration digits"
        });
      }

      filters.chassis_first6_reg_last4 = {
        chassis6: chassis6_reg4.slice(0, 6),
        regLast4: chassis6_reg4.slice(6)
      };
    }
    else if (engine6_reg4) {          // ✅ ADD THIS
  if (engine6_reg4.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Enter 6 engine + 4 registration digits"
    });
  }

  filters.engine_first6_reg_last4 = {
    engine6: engine6_reg4.slice(0, 6),
    regLast4: engine6_reg4.slice(6)
  };
}
    else if (registration_number) {
      filters.registration_number = registration_number;
    }
    else if (chassis_number) {
      filters.chassis_number = chassis_number;
    }
    else if (engine_number) {
      filters.engine_number = engine_number;
    }
    else if (engine_or_chassis_last5) {
      filters.engine_or_chassis_last5 = engine_or_chassis_last5;
    }
    else if (engine_or_chassis_last6) {
      filters.engine_or_chassis_last6 = engine_or_chassis_last6;
    }

    const data = await recoveredVehicleService.getRecoveredVehicles(filters);

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
