module.exports = {
  RecoveredVehicleSubmission: {
    type: "object",
    description:
      "Customer recovered-vehicle submission. All fields are sent in the application/json request body; registration_number is the only field validated as required by the controller.",
    required: ["registration_number"],
    properties: {
      case_status: {
        type: "string",
        description: "Recovery case status.",
        example: "Recovered",
      },
      registration_number: {
        type: "string",
        description: "Vehicle registration number. Required.",
        example: "DL01AB1234",
      },
      vehicle_type: {
        type: "string",
        description: "Vehicle category.",
        example: "Car",
      },
      manufacturing_year: {
        oneOf: [{ type: "integer" }, { type: "string" }],
        description: "Year of manufacture.",
        example: 2021,
      },
      engine_number: {
        type: "string",
        description: "Vehicle engine number.",
        example: "K12MN1234567",
      },
      chassis_number: {
        type: "string",
        description: "Vehicle chassis number.",
        example: "MA3EJKD1S00A12345",
      },
      make: {
        type: "string",
        description: "Vehicle make/manufacturer.",
        example: "Maruti Suzuki",
      },
      model: {
        type: "string",
        description: "Vehicle model.",
        example: "Swift",
      },
      color: {
        type: "string",
        description: "Vehicle colour.",
        example: "White",
      },
      police_station: {
        type: "string",
        description: "Police station handling the recovery.",
        example: "Civil Lines",
      },
      state: {
        type: "string",
        description: "Recovery state.",
        example: "Delhi",
      },
      districts: {
        type: "string",
        description: "Recovery district.",
        example: "North Delhi",
      },
      city: { type: "string", description: "Recovery city.", example: "Delhi" },
      fir_number: {
        type: "string",
        description: "Related FIR number.",
        example: "123/2025",
      },
      contact_person: {
        type: "string",
        description: "Contact person for recovery details.",
        example: "Ravi Kumar",
      },
      email_address: {
        type: "string",
        description: "Contact email address.",
        format: "email",
        example: "ravi@example.com",
      },
      contact_number: {
        type: "string",
        description: "Contact telephone number.",
        example: "9876543210",
      },
      fir_date: {
        type: "string",
        description: "Related FIR date.",
        example: "2025-07-12",
      },
      recovery_location: {
        type: "string",
        description: "Location where the vehicle was recovered.",
        example: "Kashmere Gate",
      },
      recovery_date: {
        type: "string",
        description: "Date of recovery.",
        example: "2025-07-13",
      },
    },
  },
  RecoveredVehicle: {
    type: "object",
    additionalProperties: true,
    example: {
      registration_number: "DL01AB1234",
      engine_number: "K12MN1234567",
      chassis_number: "MA3EJKD1S00A12345",
      make: "Maruti Suzuki",
      model: "Swift",
      color: "White",
    },
  },
};
