module.exports = {
  Challan: {
    type: "object",
    properties: {
      srNo: { type: "integer", example: 1 },
      registrationNumber: { type: "string", example: "DL01AB1234" },
      make: { type: "string", example: "Maruti" },
      model: { type: "string", example: "Swift" },
      colour: { type: "string", example: "White" },
      mfgYear: {
        oneOf: [{ type: "integer" }, { type: "string" }],
        example: 2021,
      },
      theftDate: { type: "string", nullable: true },
      incidentType: { type: "string", example: "Before" },
      challanNumber: { type: "string", example: "CHL-2025-001" },
      noOfChallan: { type: "integer", example: 2 },
      totalValue: { type: "number", example: 1500 },
      idSubmitted: { type: "string", example: "No" },
      viewId: { type: "string", example: "" },
    },
  },
};
