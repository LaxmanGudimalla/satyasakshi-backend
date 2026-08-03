module.exports = {
  StolenVehicleSubmission: {
    type: "object",
    description:
      "Customer stolen-vehicle submission. All fields are sent in the application/json request body; registration_number is the only field validated as required by the controller. The current insert service persists registration, engine, chassis, vehicle type, make, model, colour, FIR, police station, state, and district; the remaining supplied customer fields are accepted but are not persisted by that service yet.",
    required: ["registration_number"],
    properties: {
      state: {
        type: "string",
        description: "State where the theft was reported.",
        example: "Delhi",
      },
      district: {
        type: "string",
        description: "District where the theft was reported.",
        example: "North Delhi",
      },
      police_station: {
        type: "string",
        description: "Police station handling the report.",
        example: "Civil Lines",
      },
      fir_number: {
        type: "string",
        description: "FIR number, if available.",
        example: "123/2025",
      },
      fir_date: {
        type: "string",
        description: "FIR date accepted by the service.",
        example: "2025-07-12",
      },
      registration_number: {
        type: "string",
        description: "Vehicle registration number. Required.",
        example: "DL01AB1234",
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
      vehicle_type: {
        type: "string",
        description: "Vehicle category.",
        example: "Car",
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
      manufacturing_year: {
        oneOf: [{ type: "integer" }, { type: "string" }],
        description:
          "Year selected by the customer. Accepted but not persisted by the current service.",
        example: 2021,
      },
      color: {
        type: "string",
        description: "Vehicle colour.",
        example: "White",
      },
      recovery_location: {
        type: "string",
        description:
          "Recovery location. Accepted but not persisted by the current service.",
        example: "Kashmere Gate",
      },
      recovery_date: {
        type: "string",
        description:
          "Recovery date. Accepted but not persisted by the current service.",
        example: "2025-07-13",
      },
      contact_person: {
        type: "string",
        description:
          "Customer contact person name. Accepted but not persisted by the current service.",
        example: "Ravi Kumar",
      },
      contact_number: {
        type: "string",
        description:
          "Customer contact telephone number. Accepted but not persisted by the current service.",
        example: "9876543210",
      },
      email_address: {
        type: "string",
        format: "email",
        description:
          "Customer contact email address. Accepted but not persisted by the current service.",
        example: "ravi@example.com",
      },
      city: {
        type: "string",
        description: "City. Accepted but not persisted by the current service.",
        example: "Delhi",
      },
    },
  },
  StolenVehicle: {
    type: "object",
    additionalProperties: true,
    example: {
      registration_number: "DL01AB1234",
      engine_number: "K12MN1234567",
      chassis_number: "MA3EJKD1S00A12345",
      vehicle_type: "Car",
      vehicle_make: "Maruti Suzuki",
      vehicle_model: "Swift",
    },
  },
};
