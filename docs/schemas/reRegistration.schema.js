module.exports = {
  ReRegistrationResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      status: { type: "integer", example: 1 },
      vehicleInformation: {
        type: "array",
        items: { type: "object", additionalProperties: true },
      },
      popupDetails: {
        type: "array",
        items: { type: "object", additionalProperties: true },
      },
      searchVehicleDetails: {
        type: "array",
        items: { type: "object", additionalProperties: true },
      },
    },
    example: {
      success: true,
      status: 1,
      vehicleInformation: [
        {
          srNo: 1,
          registrationNumber: "DL01AB1234",
          chassisNumber: "MA3EJKD1S00A12345",
          engineNumber: "K12MN1234567",
          make: "MARUTI",
          model: "Swift",
          registrationYear: 2021,
          colour: "White",
          rtoCode: "DL01",
        },
      ],
      popupDetails: [
        {
          ownerName: "Aarav Sharma",
          officeCode: "DL01",
          vehicleClass: "MOTOR CAR",
          color: "White",
          fitnessDate: "From DB Next Phase",
          recordFoundIn: "V4",
        },
      ],
      searchVehicleDetails: [
        {
          srNo: 1,
          vehicleNumber: "DL01AB1234",
          officeCode: "DL01",
          chassisNumber: "MA3EJKD1S00A12345",
          ownerName: "Aarav Sharma",
          vehicleClass: "MOTOR CAR",
          color: "White",
          fitnessDate: "31 Jul, 2031",
          recordFoundIn: "V4",
          recordFoundInDb: "Maruti Suzuki",
        },
      ],
    },
  },
};
