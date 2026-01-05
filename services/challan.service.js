const db = require("../config/db");

exports.fetchChallanData = async (registrationNumber) => {

  const [result] = await db.query(
    `
    SELECT
      c.challan_no,
      c.reg_no,
      COUNT(o.id) AS noOfOffences,
      COALESCE(SUM(o.penalty), 0) AS totalValue
    FROM challans c
    LEFT JOIN challan_offences o
      ON c.challan_no = o.challan_no
    WHERE c.reg_no = ?
    GROUP BY c.challan_no, c.reg_no
    ORDER BY c.challan_date DESC
    `,
    [registrationNumber]
  );

  let srNo = 1;

  return result.map(row => ({
    srNo: srNo++,
    registrationNumber: row.reg_no,
    make: "NA",
    model: "NA",
    colour: "NA",
    mfgYear: "NA",
    theftDate: "DD-MMM-YYYY",
    challanIncident: row.noOfOffences > 0 ? "Yes" : "No",
    challanNumber: row.challan_no,
    noOfChallan: row.noOfOffences,
    totalValue: row.totalValue,
    idSubmitted: "No",
    viewId: ""
  }));
};
