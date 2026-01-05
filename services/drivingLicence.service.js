const db = require("../config/db");

exports.getDrivingLicenceData = async (searchParams) => {
  const { registrationNumber, chassisNumber, engineNumber } = searchParams;

  const searchQuery = `
    SELECT l.*
    FROM vehicles v
    JOIN licenses l ON v.license_id = l.id
    WHERE v.registration_number = ?
       OR v.chassis_number = ?
       OR v.engine_number = ?
    LIMIT 1
  `;

  const [licenseResult] = await db.query(searchQuery, [
    registrationNumber,
    chassisNumber,
    engineNumber
  ]);

  if (licenseResult.length === 0) {
    return null;
  }

  const license = licenseResult[0];

  const [categories] = await db.query(
    `SELECT code, description, issued_date 
     FROM license_categories 
     WHERE license_id = ?`,
    [license.id]
  );

  const [personalInfoResult] = await db.query(
    `SELECT * FROM personal_information WHERE license_id = ?`,
    [license.id]
  );

  const personalInfo = personalInfoResult[0];

  const [additionalDetailsResult] = await db.query(
    `SELECT * FROM additional_details WHERE personal_info_id = ?`,
    [personalInfo.id]
  );

  return {
    license,
    categories,
    personalInfo,
    additionalDetails: additionalDetailsResult[0]
  };
};
