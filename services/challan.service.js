const db = require("../config/db");

exports.fetchChallanData = async (registrationNumber) => {

  const [rows] = await db.query(
    `
    SELECT
      c.challan_no,
      c.reg_no,
       c.challan_incident,
     MAX(c.theft_date) AS theft_date,
MAX(c.challan_date) AS challan_date,

CASE
  WHEN MAX(c.challan_date) > MAX(c.theft_date)
  THEN 'After'
  ELSE 'Before'
END AS incidentType,


      COUNT(o.id) AS noOfOffences,
      COALESCE(SUM(CAST(o.penalty AS DECIMAL(10,2))), 0) AS totalValue,

      v.colour,
      v.registration_year,

      mk.make_code AS make,
      md.model AS model

    FROM challans c

    LEFT JOIN challan_offences o
      ON c.challan_no = o.challan_no

    LEFT JOIN vehicles v
      ON TRIM(UPPER(v.registration_number)) = TRIM(UPPER(c.reg_no))

    LEFT JOIN make_master mk
      ON mk.company_id = v.company_id

    LEFT JOIN model_master md
      ON md.model_id = v.model_id

    WHERE c.reg_no = ?

    GROUP BY
      c.challan_no,
      c.reg_no,
      v.colour,
      v.registration_year,
      mk.make_code,
      md.model

    ORDER BY c.challan_date DESC
    `,
    [registrationNumber]
  );

  let srNo = 1;

  return rows.map(r => ({
    srNo: srNo++,
    registrationNumber: r.reg_no,

    make: r.make || "NA",
    model: r.model || "NA",

    colour: r.colour || "NA",
    mfgYear: r.registration_year || "NA",

    theftDate: r.theft_date,
    // challanIncident: r.noOfOffences > 0 ? "Yes" : "No",
    incidentType: r.incidentType,

       challanNumber: r.challan_no,   

    noOfChallan: r.noOfOffences,
    totalValue: Number(r.totalValue),
idSubmitted: r.challan_incident === "YES" ? "Yes" : "No",

    viewId: ""
  }));
};
