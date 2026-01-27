// stolenVehicle.service.js

const db = require("../config/db");

const toMysqlDate = (dateStr) => {
  if (!dateStr) return null;

  if (dateStr.includes("-")) return dateStr;

  // DD/MM/YYYY or DD/MM/YYYY HH:mm:ss
  const [datePart, timePart] = dateStr.split(" ");
  const [dd, mm, yyyy] = datePart.split("/");

  if (!dd || !mm || !yyyy) return null;

  return timePart
    ? `${yyyy}-${mm}-${dd} ${timePart}`
    : `${yyyy}-${mm}-${dd}`;
};

const cleanText = (val, maxLen = 100) => {
  if (!val) return null;

  return val
    .toString()
    .replace(/\s+/g, " ")   // normalize spaces
    .trim()
    .substring(0, maxLen);
};


exports.addOrUpdateStolenVehicle = async (payload) => {
  const sql = `
    INSERT INTO stolen_vehicles (
      missing_vehicle_id,
      state, district, police_station,
      control_room_no,
      fir_number, fir_date, report_datetime,
      registration_number, engine_number, chassis_number,
      complainant, complainant_phone, address,
      vehicle_type, vehicle_make, vehicle_model, vehicle_color,
      missing_status, stolen_date, stolen_from, recovered_from,
      vehicle_year, insurance_company,
      created_on, updated_on,
      is_deleted
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON DUPLICATE KEY UPDATE   
      missing_status = VALUES(missing_status),
      police_station = VALUES(police_station),
      district = VALUES(district),
      state = VALUES(state),
      recovered_from = VALUES(recovered_from),
      fir_date = VALUES(fir_date),
      report_datetime = VALUES(report_datetime),
      stolen_date = VALUES(stolen_date),
      updated_on = VALUES(updated_on),
      is_deleted = VALUES(is_deleted)
  `;

const params = [
  payload.missing_vehicle_id,
  cleanText(payload.state, 50),
  cleanText(payload.district, 100),
  cleanText(payload.police_station, 150),
  cleanText(payload.control_room_no, 20),
  cleanText(payload.fir_number, 50),
  toMysqlDate(payload.fir_date),
  toMysqlDate(payload.report_datetime),
  cleanText(payload.registration_number, 20),
  cleanText(payload.engine_number, 50),
  cleanText(payload.chassis_number, 50),
  cleanText(payload.complainant, 150),
  cleanText(payload.complainant_phone, 20),
  cleanText(payload.address, 255),
  cleanText(payload.vehicle_type, 50),
  cleanText(payload.vehicle_make, 150),
  cleanText(payload.vehicle_model, 100),
  cleanText(payload.vehicle_color, 50),
  cleanText(payload.missing_status, 50),
  toMysqlDate(payload.stolen_date),
  cleanText(payload.stolen_from, 100),
  cleanText(payload.recovered_from, 100),
  payload.vehicle_year,
  cleanText(payload.insurance_company, 150),
  toMysqlDate(payload.created_on),
  toMysqlDate(payload.updated_on),
  payload.is_deleted ? 1 : 0
];


  return db.query(sql, params);
};


/* =========================
   SEARCH STOLEN VEHICLES
   ========================= */
exports.getStolenVehicles = async (filters) => {
  let sql = `SELECT * FROM stolen_vehicles WHERE 1=1`;
  let params = [];

  // 1️⃣ Exact Registration Number
  if (filters.registration_number) {
    sql += ` AND registration_number = ?`;
    params.push(filters.registration_number.trim());
  }

  // 2️⃣ Exact Chassis Number
  if (filters.chassis_number) {
    sql += ` AND chassis_number = ?`;
    params.push(filters.chassis_number.trim());
  }

  // 3️⃣ Exact Engine Number
  if (filters.engine_number) {
    sql += ` AND engine_number = ?`;
    params.push(filters.engine_number.trim());
  }

  // 4️⃣ Chassis FIRST 6 + Registration LAST 4
  if (filters.chassis_first6_reg_last4) {
    sql += `
      AND LEFT(chassis_number, 6) = ?
      AND RIGHT(registration_number, 4) = ?
    `;
    params.push(
      filters.chassis_first6_reg_last4.chassis6,
      filters.chassis_first6_reg_last4.regLast4
    );
  }

  // 5️⃣ Engine FIRST 6 + Registration LAST 4
  if (filters.engine_first6_reg_last4) {
    sql += `
      AND LEFT(engine_number, 6) = ?
      AND RIGHT(registration_number, 4) = ?
    `;
    params.push(
      filters.engine_first6_reg_last4.engine6,
      filters.engine_first6_reg_last4.regLast4
    );
  }

  // 6️⃣ Engine OR Chassis LAST 5
  if (filters.engine_or_chassis_last5) {
    sql += `
      AND (
        RIGHT(engine_number, 5) = ?
        OR RIGHT(chassis_number, 5) = ?
      )
    `;
    params.push(
      filters.engine_or_chassis_last5,
      filters.engine_or_chassis_last5
    );
  }

  // 7️⃣ Engine OR Chassis LAST 6
  if (filters.engine_or_chassis_last6) {
    sql += `
      AND (
        RIGHT(engine_number, 6) = ?
        OR RIGHT(chassis_number, 6) = ?
      )
    `;
    params.push(
      filters.engine_or_chassis_last6,
      filters.engine_or_chassis_last6
    );
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};

exports.commonSearchStolenVehicles = async (v) => {
  const len = v.length;

  let sql = `
    SELECT * FROM stolen_vehicles
    WHERE
      registration_number = ?
      OR engine_number = ?
      OR chassis_number = ?
  `;
  let params = [v, v, v];

  // 6 engine/chassis + 4 reg
  if (len === 10) {
    sql += `
      OR (
        LEFT(engine_number,6) = ?
        AND RIGHT(registration_number,4) = ?
      )
      OR (
        LEFT(chassis_number,6) = ?
        AND RIGHT(registration_number,4) = ?
      )
    `;
    params.push(
      v.slice(0, 6), v.slice(6),
      v.slice(0, 6), v.slice(6)
    );
  }

  // Last 6
  if (len === 6) {
    sql += `
      OR RIGHT(engine_number,6) = ?
      OR RIGHT(chassis_number,6) = ?
    `;
    params.push(v, v);
  }

  // Last 5
  if (len === 5) {
    sql += `
      OR RIGHT(engine_number,5) = ?
      OR RIGHT(chassis_number,5) = ?
    `;
    params.push(v, v);
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};