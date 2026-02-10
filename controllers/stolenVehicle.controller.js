// controllers/stolenVehicle.controller.js

const stolenVehicleService = require("../services/stolenVehicle.service");

exports.getStolenVehicles = async (req, res) => {
  try {

   /* =====================================
   🔥 COMMON SEARCH (ISOLATED)
   ===================================== */
if (req.query.commonSearch) {
  const v = req.query.commonSearch.trim().toUpperCase();

  const data =
    await stolenVehicleService.commonSearchStolenVehicles(v);

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
    else if (engine6_reg4) {
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

    const data = await stolenVehicleService.getStolenVehicles(filters);

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
    console.error("❌ Get Stolen Vehicle Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//for customer adding the stolen vehicle
exports.addCustomerStolenVehicle = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.registration_number) {
      return res.status(400).json({
        success: false,
        message: "registration_number is required"
      });
    }

    // 🔍 Duplicate check
    const duplicate = await stolenVehicleService.checkDuplicateStolenVehicle({
      registration_number: payload.registration_number,
      engine_number: payload.engine_number,
      chassis_number: payload.chassis_number
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          duplicate.source === "official"
            ? "Vehicle already exists in official stolen records"
            : "Vehicle already submitted by another customer"
      });
    }

    // Save to customer table
    const result = await stolenVehicleService.addCustomerStolenVehicle(payload);

    res.status(201).json({
      success: true,
      message: "Stolen vehicle submitted successfully",
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error("❌ Customer Stolen Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
