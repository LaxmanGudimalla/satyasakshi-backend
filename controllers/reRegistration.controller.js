const reRegService = require("../services/reRegistration.service");

exports.getReRegistrationData = async (req, res) => {

  const { registrationNumber, chassisNumber, engineNumber } = req.query;

  const vehicles = await reRegService.getReRegistrationData({
    registrationNumber,
    chassisNumber,
    engineNumber
  });

  if (!vehicles || vehicles.length === 0) {
    return res.send({ success:false, status:0, message:"No data found" });
  }

  res.send({
    success: true,
    status: 1,

    // ---------- ARRAY SECTION 1 ----------
    vehicleInformation: vehicles.map((v, index) => ({
      srNo: index + 1,
      registrationNumber: v.registration_number,
      chassisNumber: v.chassis_number,
      engineNumber: v.engine_number,
      make: v.make_code,
      model: v.model,
      registrationYear: v.registration_year,
      colour: v.colour,
      rtoCode: v.rto_code || ""
    })),

    // ---------- ARRAY FOR POPUP ----------
    popupDetails: vehicles.map(v => ({
      ownerName: v.owner_name,
      officeCode: v.registration_number?.substring(0,4) || "",
      vehicleClass: v.vehicle_type || "MOTOR CAR",
      color: v.colour,
      fitnessDate: "From DB Next Phase",
      recordFoundIn: "V4"
    })),

    // ---------- ARRAY SECTION 2 ----------
    searchVehicleDetails: vehicles.map(v => ({
      srNo: 1,
      vehicleNumber: v.registration_number,
      officeCode: v.registration_number?.substring(0,4) || "",
      chassisNumber: v.chassis_number,
      ownerName: v.owner_name,
      vehicleClass: v.vehicle_type || "MOTOR CAR",
      color: v.colour,
      fitnessDate: "31 Jul, 2031",
      recordFoundIn: "V4",
      recordFoundInDb: v.company_name
    }))
  });
};
