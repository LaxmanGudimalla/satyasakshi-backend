module.exports = function mapVehicle(v) {
  return {
    // 🔹 ZIPNET primary reference
    id: v.UnclaimedSeizedVehiclesId || null,

    // 🔹 Case & diary
    dd_no: v.DDNo || null,
    case_status: v.Status || null, 

    // 🔹 Vehicle details
    registration_number: v.VehicleRegistrationNo || null,
    vehicle_type: v.VehicleType || null,
    other_vehicle_type: null,
    manufacturing_year: v.Year || null,

    engine_number: v.VehicleEngineNo || null,
    chassis_number: v.VehicleChasisNo || null,

    make: v.VehicleMake?.trim() || null,
    model: v.VehicleModel?.trim() || null,
    color: v.VehicleColor || null,

    // 🔹 Location / Police
    police_station: v.PoliceStation || null,
    state: v.State || null,
    districts: v.District || null,

    // 🔹 City (best-possible safe logic)
    // ZIPNET does not explicitly give city, so keep null
    city: null,

    // 🔹 FIR (DO NOT derive from DD)
    fir_number: v.FIRNo || null,
    fir_date: v.FIRDate ? formatDate(v.FIRDate) : null,

    // 🔹 Recovery / seizure info
    recovery_location: v.PoliceStation || null,
    recovery_date: v.DD_Date ? formatDate(v.DD_Date) : null,

    // 🔹 Contact (ZIPNET doesn't expose)
    contact_person: null,
    email_address: null,
    contact_number: null,

    // 🔹 Remarks (duplicate-safe)
    remark: v.Status || null,

    // 🔹 Audit
    created_on: v.CreatedOn ? toMysqlDate(v.CreatedOn) : null,
    updated_on: null   // ZIPNET usually sends invalid date
  };
};