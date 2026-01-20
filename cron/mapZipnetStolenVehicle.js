// services/mapZipnetStolenVehicle.js

module.exports = function mapZipnetStolenVehicle(v) {
  return {
    missing_vehicle_id: v.MissingVehiclesId,

    state: v.State || null,
    district: v.District || null,
    police_station: v.PoliceStation || null,

    control_room_no: v.ControlRoomNo || null,

    fir_number: v.FIRNo || null,
    fir_date: v.FIRDate || null,
    report_datetime: v.ReportDateTime || null,

    registration_number: v.VehicleRegistrationNo || null,
    engine_number: v.VehicleEngineNo || null,
    chassis_number: v.VehicleChasisNo || null,

    complainant: v.Complainant || null,
    complainant_phone: v.ComplainantPhoneNumber || null,
    address: v.Address || null,

    vehicle_type: v.VehicleType || null,
    vehicle_make: v.VehicleMake || null,
    vehicle_model: v.VehicleModel || null,
    vehicle_color: v.VehicleColor || null,

    missing_status: v.MissingStatus || null,
    stolen_date: v.StolenDate || null,
    stolen_from: v.StolenFrom || null,
    recovered_from: v.RecoveredFrom || null,

    vehicle_year: v.Year || null,
    insurance_company: v.INS || null,

    created_on: v.CreatedOn || null,
    updated_on: v.UpdatedOn || null,

    is_deleted: v.IsDeleted || false
  };
};
