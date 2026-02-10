// recoveredVehicle.service.js

const db = require("../config/db");

const toMysqlDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes("-")) return dateStr;

  const [dd, mm, yyyy] = dateStr.split("/");
  if (!dd || !mm || !yyyy) return null;

  return `${yyyy}-${mm}-${dd}`;
};

const cleanText = (val, maxLen = 100) => {
  if (val === undefined || val === null) return null;

  return val
    .toString()
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, maxLen);
};



// exports.checkDuplicateRecoveredVehicle = async ({
//   registration_number,
//   engine_number,
//   chassis_number
// }) => {
//   const query = `
//     SELECT
//       registration_number,
//       engine_number,
//       chassis_number
//     FROM recovered_vehicles
//     WHERE registration_number = ?
//        OR engine_number = ?
//        OR chassis_number = ?
//     LIMIT 1
//   `;

//   const [rows] = await db.query(query, [
//     registration_number,
//     engine_number,
//     chassis_number
//   ]);

//   return rows.length > 0 ? rows[0] : null;
// };

exports.checkDuplicateRecoveredVehicle = async ({
  registration_number,
  engine_number,
  chassis_number
}) => {
  let conditions = [];
  let params = [];

  if (registration_number && registration_number.trim() !== "") {
    conditions.push("registration_number = ?");
    params.push(registration_number.trim());
  }

  if (engine_number && engine_number.trim() !== "") {
    conditions.push("engine_number = ?");
    params.push(engine_number.trim());
  }

  if (chassis_number && chassis_number.trim() !== "") {
    conditions.push("chassis_number = ?");
    params.push(chassis_number.trim());
  }

  if (conditions.length === 0) return null;

  const whereClause = conditions.join(" OR ");

  // Check BOTH tables
  const query = `
    SELECT registration_number, engine_number, chassis_number, 'official' AS source
    FROM recovered_vehicles
    WHERE ${whereClause}

    UNION

    SELECT registration_number, engine_number, chassis_number, 'customer' AS source
    FROM customer_recovered_vehicles
    WHERE ${whereClause}

    LIMIT 1
  `;

  const [rows] = await db.query(query, [...params, ...params]);

  return rows.length > 0 ? rows[0] : null;
};

// To add a new recovered vehicle in the database from Customer side.
exports.addRecoveredVehicle = async (payload) => {
  const {
    case_status,
     dd_no,
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
    INSERT INTO customer_recovered_vehicles (
      case_status,
      dd_no,
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
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const safeDdNo =
  dd_no && dd_no.trim() !== "" ? dd_no : "NA";

  const [result] = await db.query(insertQuery, [
    case_status,
    safeDdNo,
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
    toMysqlDate(fir_date),
    recovery_location,
    toMysqlDate(recovery_date),
    remark || null
  ]);

  return result;
};

exports.getRecoveredVehicles = async (filters) => {
  let sql = `SELECT * FROM recovered_vehicles WHERE 1=1`;
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

//To get the records from ZIPNET
exports.addOrUpdateRecoveredVehicle = async (p) => {
  const sql = `
    INSERT INTO recovered_vehicles (
      zipnet_ref_id,
      dd_no, case_status,
      registration_number, vehicle_type, other_vehicle_type,
      manufacturing_year, engine_number, chassis_number,
      make, model, color,
      police_station, state, districts, city,
      fir_number, fir_date,
      recovery_location, recovery_date,
      contact_person, email_address, contact_number,
      remark,
      created_on
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      case_status = VALUES(case_status),
      police_station = VALUES(police_station),
      state = VALUES(state),
      districts = VALUES(districts),
      registration_number = VALUES(registration_number),
      engine_number = VALUES(engine_number),
      chassis_number = VALUES(chassis_number),
      make = VALUES(make),
      model = VALUES(model),
      color = VALUES(color),
      fir_date = VALUES(fir_date),
      recovery_location = VALUES(recovery_location),
      recovery_date = VALUES(recovery_date),
      contact_person = VALUES(contact_person),
      contact_number = VALUES(contact_number),
      remark = VALUES(remark)
  `;

  const params = [
    p.zipnet_ref_id,
    cleanText(p.dd_no, 50),
    cleanText(p.case_status, 50),
    cleanText(p.registration_number, 20),
    cleanText(p.vehicle_type, 50),
    cleanText(p.other_vehicle_type, 50),
    p.manufacturing_year,
    cleanText(p.engine_number, 100),
    cleanText(p.chassis_number, 100),
    cleanText(p.make, 100),
    cleanText(p.model, 100),
    cleanText(p.color, 50),
    cleanText(p.police_station, 150),
    cleanText(p.state, 100),
    cleanText(p.districts, 100),
    cleanText(p.city, 100),
    cleanText(p.fir_number, 100),
    toMysqlDate(p.fir_date),
    cleanText(p.recovery_location, 255),
    toMysqlDate(p.recovery_date),
    cleanText(p.contact_person, 150),
    cleanText(p.email_address, 150),
    cleanText(p.contact_number, 20),
    cleanText(p.remark, 500),
    p.created_on ? toMysqlDate(p.created_on) : null
  ];

  return db.query(sql, params);
};

exports.commonSearchRecoveredVehicles = async (v) => {
  const len = v.length;

  let sql = `
    SELECT * FROM recovered_vehicles
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