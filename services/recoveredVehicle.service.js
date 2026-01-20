// recoveredVehicle.service.js

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
    INSERT INTO recovered_vehicles (
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(insertQuery, [
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
exports.addOrUpdateRecoveredVehicle = async (payload) => {
  const {
    dd_no,
    case_statu,
    state,
    districts,
    city,
    fir_number,
    fir_date,
    recovery_location,
    recovery_date,
    contact_person,
    email_adds,
    registration_number,
    vehicle_type,
    other_vehicle_type,
    manufacturing_year,
    engine_number,
    chassis_number,
    make,
    model,
    color,
    police_stationress,
    contact_number,
    remark
  } = payload;

  const sql = `
    INSERT INTO recovered_vehicles (
      dd_no,
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
      fir_date,
      recovery_location,
      recovery_date,
      contact_person,
      email_address,
      contact_number,
      remark
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      case_status = VALUES(case_status),
      registration_number = VALUES(registration_number),
      vehicle_type = VALUES(vehicle_type),
      other_vehicle_type = VALUES(other_vehicle_type),
      manufacturing_year = VALUES(manufacturing_year),
      engine_number = VALUES(engine_number),
      chassis_number = VALUES(chassis_number),
      make = VALUES(make),
      model = VALUES(model),
      color = VALUES(color),
      police_station = VALUES(police_station),
      state = VALUES(state),
      districts = VALUES(districts),
      city = VALUES(city),
      fir_number = VALUES(fir_number),
      fir_date = VALUES(fir_date),
      recovery_location = VALUES(recovery_location),
      recovery_date = VALUES(recovery_date),
      contact_person = VALUES(contact_person),
      email_address = VALUES(email_address),
      contact_number = VALUES(contact_number),
      remark = VALUES(remark)
  `;

const params = [
  dd_no || null,
  case_status || null,
  registration_number || null,
  vehicle_type || null,
  other_vehicle_type || null,
  manufacturing_year || null,
  engine_number || null,
  chassis_number || null,
  make || null,
  model || null,
  color || null,
  police_station || null,
  state || null,
  districts || null,
  city || null,
  fir_number || null,
  fir_date || null,
  recovery_location || null,
  recovery_date || null,   // <-- MISSING BEFORE
  contact_person || null,
  email_address || null,
  contact_number || null,
  remark || null
];

  console.log("PARAM COUNT:", params.length);

  return db.query(sql, params);
};







// const db = require("../config/db");

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


// exports.addRecoveredVehicle = async (payload) => {
//   const {
//     case_status,
//      dd_no,
//     registration_number,
//     vehicle_type,
//     other_vehicle_type,
//     manufacturing_year,
//     engine_number,
//     chassis_number,
//     make,
//     model,
//     color,
//     police_station,
//     state,
//     districts,
//     city,
//     fir_number,
//     contact_person,
//     email_address,
//     contact_number,
//     fir_date,
//     recovery_location,
//     recovery_date,
//     remark
//   } = payload;

//   const insertQuery = `
//     INSERT INTO recovered_vehicles (
//       case_status,
//       dd_no,
//       registration_number,
//       vehicle_type,
//       other_vehicle_type,
//       manufacturing_year,
//       engine_number,
//       chassis_number,
//       make,
//       model,
//       color,
//       police_station,
//       state,
//       districts,
//       city,
//       fir_number,
//       contact_person,
//       email_address,
//       contact_number,
//       fir_date,
//       recovery_location,
//       recovery_date,
//       remark
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const [result] = await db.query(insertQuery, [
//     case_status,
//     dd_no,
//     registration_number,
//     vehicle_type,
//     other_vehicle_type,
//     manufacturing_year,
//     engine_number,
//     chassis_number,
//     make,
//     model,
//     color,
//     police_station,
//     state,
//     districts,
//     city,
//     fir_number,
//     contact_person,
//     email_address,
//     contact_number,
//     fir_date,
//     recovery_location,
//     recovery_date,
//     remark
//   ]);

//   return result;
// };

// exports.getRecoveredVehicles = async (filters) => {
//   let sql = `SELECT * FROM recovered_vehicles WHERE 1=1`;
//   let params = [];

//   // 1️⃣ Exact Registration Number
//   if (filters.registration_number) {
//     sql += ` AND registration_number = ?`;
//     params.push(filters.registration_number.trim());
//   }

//   // 2️⃣ Exact Chassis Number
//   if (filters.chassis_number) {
//     sql += ` AND chassis_number = ?`;
//     params.push(filters.chassis_number.trim());
//   }

//   // 3️⃣ Exact Engine Number
//   if (filters.engine_number) {
//     sql += ` AND engine_number = ?`;
//     params.push(filters.engine_number.trim());
//   }

//   // 4️⃣ Chassis FIRST 6 + Registration LAST 4
//   if (filters.chassis_first6_reg_last4) {
//     sql += `
//       AND LEFT(chassis_number, 6) = ?
//       AND RIGHT(registration_number, 4) = ?
//     `;
//     params.push(
//       filters.chassis_first6_reg_last4.chassis6,
//       filters.chassis_first6_reg_last4.regLast4
//     );
//   }

//   // 5️⃣ Engine FIRST 6 + Registration LAST 4
//   if (filters.engine_first6_reg_last4) {
//     sql += `
//       AND LEFT(engine_number, 6) = ?
//       AND RIGHT(registration_number, 4) = ?
//     `;
//     params.push(
//       filters.engine_first6_reg_last4.engine6,
//       filters.engine_first6_reg_last4.regLast4
//     );
//   }

//   // 6️⃣ Engine OR Chassis LAST 5
//   if (filters.engine_or_chassis_last5) {
//     sql += `
//       AND (
//         RIGHT(engine_number, 5) = ?
//         OR RIGHT(chassis_number, 5) = ?
//       )
//     `;
//     params.push(
//       filters.engine_or_chassis_last5,
//       filters.engine_or_chassis_last5
//     );
//   }

//   // 7️⃣ Engine OR Chassis LAST 6
//   if (filters.engine_or_chassis_last6) {
//     sql += `
//       AND (
//         RIGHT(engine_number, 6) = ?
//         OR RIGHT(chassis_number, 6) = ?
//       )
//     `;
//     params.push(
//       filters.engine_or_chassis_last6,
//       filters.engine_or_chassis_last6
//     );
//   }

//   const [rows] = await db.execute(sql, params);
//   return rows;
// };