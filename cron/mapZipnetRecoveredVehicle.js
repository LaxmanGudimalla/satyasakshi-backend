const toMysqlDate = (dateStr) => {
  if (!dateStr) return null;

  const val = String(dateStr).trim();

  // Already MySQL format
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

  // ZIPNET format: DD/MM/YYYY
  if (val.includes("/")) {
    const [dd, mm, yyyy] = val.split("/");
    if (dd && mm && yyyy) {
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  return null;
};

module.exports = function mapVehicle(v) {
  return {
    // 🔑 ZIPNET identity (ONLY unique reference)
    zipnet_ref_id: v.UnclaimedSeizedVehiclesId || null,

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
    city: null,

    // 🔹 FIR & Recovery (aligned with CSV import)
    fir_number: null, // ZIPNET unreliable
    fir_date: v.DD_Date ? toMysqlDate(v.DD_Date) : null,

    recovery_location: v.PoliceStation || null,
    recovery_date: v.DD_Date ? toMysqlDate(v.DD_Date) : null,

    // 🔹 Contact (not provided by ZIPNET)
    contact_person: null,
    email_address: null,
    contact_number: null,

    // 🔹 Remarks
    remark: v.Status || null,

    // 🔹 Audit
    created_on: v.CreatedOn ? toMysqlDate(v.CreatedOn) : null,
    updated_on: null
  };
};
