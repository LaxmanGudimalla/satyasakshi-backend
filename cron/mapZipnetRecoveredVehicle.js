module.exports = function mapVehicle(v) {
  return {
    dd_no: v.UnclaimedSeizedVehiclesId || null,
    case_status: v.Status || "Unknown",

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

    fir_number: v.DDNo || null,
    fir_date: v.DD_Date || null,

    recovery_location: null,
    recovery_date: null,

    contact_person: null,
    email_address: null,
    contact_number: null,

    remark: null
  };
};
