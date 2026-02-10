const db = require("../config/db");

/* ================= PENDING ================= */

exports.getPendingRecovered = async () => {
  const [rows] = await db.query(
    "SELECT * FROM customer_recovered_vehicles ORDER BY id DESC"
  );
  return rows;
};

exports.getPendingStolen = async () => {
  const [rows] = await db.query(
    "SELECT * FROM customer_stolen_vehicles ORDER BY id DESC"
  );
  return rows;
};


/* ================= APPROVE ================= */

exports.approveRecovered = async (id) => {

  // 1️⃣ Get next missing_vehicle_id safely
  const [[row]] = await db.query(`
    SELECT 
      CASE 
        WHEN MAX(missing_vehicle_id) IS NULL THEN 1
        WHEN MAX(missing_vehicle_id) = 0 THEN 1
        ELSE MAX(missing_vehicle_id) + 1
      END AS nextId
    FROM stolen_vehicles
  `);

  const nextId = row.nextId;

  // Safety check
  if (!nextId || nextId === 0) {
    throw new Error("Failed to generate missing_vehicle_id");
  }

  await db.query(`
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
    )
    SELECT
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
    FROM customer_recovered_vehicles
    WHERE id = ?
  `, [id]);

  await db.query(
    "DELETE FROM customer_recovered_vehicles WHERE id = ?",
    [id]
  );
};


exports.approveStolen = async (id) => {
  await db.query(`
    INSERT INTO stolen_vehicles (
      registration_number,
      engine_number,
      chassis_number,
      vehicle_type,
      vehicle_make,
      vehicle_model,
      vehicle_color,
      state,
      district,
      police_station,
      fir_number,
      fir_date
    )
    SELECT
      registration_number,
      engine_number,
      chassis_number,
      vehicle_type,
      vehicle_make,
      vehicle_model,
      vehicle_color,
      state,
      district,
      police_station,
      fir_number,
      fir_date
    FROM customer_stolen_vehicles
    WHERE id = ?
  `, [id]);

  await db.query(
    "DELETE FROM customer_stolen_vehicles WHERE id = ?",
    [id]
  );
};



/* ================= REJECT ================= */

exports.rejectRecovered = async (id) => {
  await db.query(
    "DELETE FROM customer_recovered_vehicles WHERE id = ?",
    [id]
  );
};

exports.rejectStolen = async (id) => {
  await db.query(
    "DELETE FROM customer_stolen_vehicles WHERE id = ?",
    [id]
  );
};
