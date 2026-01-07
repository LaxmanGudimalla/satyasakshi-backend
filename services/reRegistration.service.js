    const db = require("../config/db");

exports.getReRegistrationData  = async ({ registrationNumber, chassisNumber, engineNumber }) => {

  let vehicleCondition = [];
  let values = [];

  if (registrationNumber) {
    vehicleCondition.push("v.registration_number = ?");
    values.push(registrationNumber);
  }

  if (chassisNumber) {
    vehicleCondition.push("v.chassis_number = ?");
    values.push(chassisNumber);
  }

  if (engineNumber) {
    vehicleCondition.push("v.engine_number = ?");
    values.push(engineNumber);
  }

  const where = vehicleCondition.join(" OR ");

  const query = `
    SELECT 
      v.id,
      v.registration_number,
      v.chassis_number,
      v.engine_number,
      v.registration_year,
      v.colour,

      cm.company_name,
      mk.make_code,
      md.model,

      pi.full_name as owner_name,
      pi.father_name,
      pi.address,
      pi.pin_code

    FROM vehicles v
    LEFT JOIN company_master cm ON v.company_id = cm.company_id
    LEFT JOIN model_master md ON v.model_id = md.model_id
    LEFT JOIN make_master mk ON md.make_id = mk.make_id
    LEFT JOIN personal_information pi ON v.license_id = pi.license_id

    WHERE ${where}
  `;

  const [rows] = await db.query(query, values);

  if (rows.length === 0) return null;

  return rows;
};
