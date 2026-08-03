module.exports = {
  SaveVehicleRequest: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "object",
        required: ["regNo", "chassisNo", "engineNo"],
        properties: {
          regNo: { type: "string", example: "DL01AB1234" },
          chassisNo: { type: "string", example: "MA3EJKD1S00A12345" },
          engineNo: { type: "string", example: "K12MN1234567" },
          maker: { type: "string", example: "Maruti Suzuki" },
          makerModal: { type: "string", example: "Swift" },
          regDate: { type: "string", format: "date", example: "2021-05-18" },
          vehicleColor: { type: "string", example: "White" },
          rtoCode: { type: "string", example: "DL01" },
        },
      },
    },
  },
  Vehicle: {
    type: "object",
    additionalProperties: true,
    example: {
      registration_number: "DL01AB1234",
      rto_code: "DL01",
      chassis_number: "MA3EJKD1S00A12345",
      engine_number: "K12MN1234567",
      make: "Maruti Suzuki",
      model: "Swift",
      registration_year: 2021,
      colour: "White",
    },
  },
};
