const db = require("../config/db");

/**
 * Save vehicle data
 */
exports.saveVehicle = async (vehicleData) => {
  const {
    regNo,
    chassisNo,
    engineNo,
    maker,
    makerModal,
    regDate,
    vehicleColor
  } = vehicleData;

  const registrationYear = regDate
    ? new Date(regDate).getFullYear()
    : null;

  const insertQuery = `
    INSERT INTO vehicle_service_history
    (
      registration_number,
      chassis_number,
      engine_number,
      make,
      model,
      registration_year,
      colour
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    regNo,
    chassisNo,
    engineNo,
    maker,
    makerModal,
    registrationYear,
    vehicleColor
  ];

  const [result] = await db.query(insertQuery, values);
  return result;
};


/**
 * Search vehicle data
 */
exports.searchVehicle = async (searchParams) => {
  const {
    registration_number,
    chassis_number,
    engine_number
  } = searchParams;

  const searchQuery = `
    SELECT *
    FROM vehicle_service_history
    WHERE registration_number = ?
       OR chassis_number = ?
       OR engine_number = ?
    LIMIT 1
  `;

  const [rows] = await db.query(searchQuery, [
    registration_number,
    chassis_number,
    engine_number
  ]);

  return rows.length ? rows[0] : null;
};
