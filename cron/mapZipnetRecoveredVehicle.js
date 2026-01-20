//mapZipnetVehicle.js

module.exports = function mapVehicle(v) {
  return {
    dd_no: v.MissingVehiclesId || null,
    case_status: v.MissingStatus || "Unknown",
    registration_number: v.VehicleRegistrationNo || null,
    vehicle_type: v.VehicleType || null,
    other_vehicle_type: null,
    manufacturing_year: null,
    engine_number: v.VehicleEngineNo || null,
    chassis_number: v.VehicleChasisNo || null,
    make: v.VehicleMake || null,
    model: v.VehicleModel || null,
    color: v.VehicleColor || null,
    police_station: v.PoliceStation || null,
    state: v.State || null,
    districts: v.District || null,
    city: null,
    fir_number: v.FIRNo || null,
    fir_date: v.FIRDate || null,
    recovery_location: v.RecoveredFrom || null,
    recovery_date: null,
    contact_person: v.Complainant || null,
    email_address: null,
    contact_number: v.ComplainantPhoneNumber || null,
    remark: v.Address || null
  };
};