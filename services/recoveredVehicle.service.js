const db = require("../config/db");

exports.checkDuplicateRecoveredVehicle = async ({
  registration_number,
  engine_number,
  chassis_number
}) => {
  const query = `
    SELECT
      registration_number,
      engine_number,
      chassis_number
    FROM recovered_vehicles
    WHERE registration_number = ?
       OR engine_number = ?
       OR chassis_number = ?
    LIMIT 1
  `;

  const [rows] = await db.query(query, [
    registration_number,
    engine_number,
    chassis_number
  ]);

  return rows.length > 0 ? rows[0] : null;
};


exports.addRecoveredVehicle = async (payload) => {
  const {
    case_status,
    registration_number,
    vehicle_type,
    other_vehicle_type,
    manufacturing_year,
    engine_number,
    chassis_number,
    make,
    model,
    color,
    police_station,
    state,
    districts,
    city,
    fir_number,
    contact_person,
    email_address,
    contact_number,
    fir_date,
    recovery_location,
    recovery_date,
    remark
  } = payload;

  const insertQuery = `
    INSERT INTO recovered_vehicles (
      case_status,
      registration_number,
      vehicle_type,
      other_vehicle_type,
      manufacturing_year,
      engine_number,
      chassis_number,
      make,
      model,
      color,
      police_station,
      state,
      districts,
      city,
      fir_number,
      contact_person,
      email_address,
      contact_number,
      fir_date,
      recovery_location,
      recovery_date,
      remark
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(insertQuery, [
    case_status,
    registration_number,
    vehicle_type,
    other_vehicle_type,
    manufacturing_year,
    engine_number,
    chassis_number,
    make,
    model,
    color,
    police_station,
    state,
    districts,
    city,
    fir_number,
    contact_person,
    email_address,
    contact_number,
    fir_date,
    recovery_location,
    recovery_date,
    remark
  ]);

  return result;
};

exports.getRecoveredVehicles = async (filters) => {
  let sql = `SELECT * FROM recovered_vehicles WHERE 1=1`;
  let params = [];

  if (filters.registration_number) {
    sql += ` AND registration_number = ?`;
    params.push(filters.registration_number.trim());
  }

  if (filters.chassis_number) {
    sql += ` AND chassis_number = ?`;
    params.push(filters.chassis_number.trim());
  }

  if (filters.engine_number) {
    sql += ` AND engine_number = ?`;
    params.push(filters.engine_number.trim());
  }

  // 🔹 Last 4 digits – chassis + reg
  if (filters.last4_chassis_reg) {
    sql += `
      AND RIGHT(chassis_number, 4) = ?
      AND RIGHT(registration_number, 4) = ?
    `;
    params.push(
      filters.last4_chassis_reg,
      filters.last4_chassis_reg
    );
  }

  // 🔹 Last 4 digits – engine + reg
  if (filters.last4_engine_reg) {
    sql += `
      AND RIGHT(engine_number, 4) = ?
      AND RIGHT(registration_number, 4) = ?
    `;
    params.push(
      filters.last4_engine_reg,
      filters.last4_engine_reg
    );
  }

  // 🔹 Last 5 digits – engine + chassis
  if (filters.last5_engine_chassis) {
    sql += `
      AND RIGHT(engine_number, 5) = ?
      AND RIGHT(chassis_number, 5) = ?
    `;
    params.push(
      filters.last5_engine_chassis,
      filters.last5_engine_chassis
    );
  }

  // 🔹 Last 6 digits – engine + chassis
  if (filters.last6_engine_chassis) {
    sql += `
      AND RIGHT(engine_number, 6) = ?
      AND RIGHT(chassis_number, 6) = ?
    `;
    params.push(
      filters.last6_engine_chassis,
      filters.last6_engine_chassis
    );
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};