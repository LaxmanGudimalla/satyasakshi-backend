const searchParameters = [
  {
    name: "commonSearch",
    in: "query",
    description:
      "Exact identifier or 10-character first-six+last-four, or last 5/6 identifier characters.",
    schema: { type: "string" },
    example: "MBLHA18315",
  },
  {
    name: "registration_number",
    in: "query",
    schema: { type: "string" },
    example: "RJ20SP8315",
  },
  {
    name: "chassis_number",
    in: "query",
    schema: { type: "string" },
    example: "MBLHA10AAB9C02425",
  },
  {
    name: "engine_number",
    in: "query",
    schema: { type: "string" },
    example: "HA10EGB9C15553",
  },
  {
    name: "chassis6_reg4",
    in: "query",
    description:
      "Exactly 10 characters: first 6 chassis characters + last 4 registration characters.",
    schema: { type: "string", minLength: 10, maxLength: 10 },
    example: "MBLHA18315",
  },
  {
    name: "engine6_reg4",
    in: "query",
    description:
      "Exactly 10 characters: first 6 engine characters + last 4 registration characters.",
    schema: { type: "string", minLength: 10, maxLength: 10 },
    example: "HA10EG8315",
  },
  {
    name: "engine_or_chassis_last5",
    in: "query",
    description: "Use 02425 (chassis) or 15553 (engine).",
    schema: { type: "string", minLength: 5, maxLength: 5 },
    example: "02425",
  },
  {
    name: "engine_or_chassis_last6",
    in: "query",
    description: "Use C02425 (chassis) or C15553 (engine).",
    schema: { type: "string", minLength: 6, maxLength: 6 },
    example: "C02425",
  },
];

const customerStolenVehicleRequest = {
  type: "object",
  description:
    "Customer stolen-vehicle submission. All fields are sent in the JSON request body. registration_number is the only field required by the controller.",
  required: ["registration_number"],
  properties: {
    registration_number: {
      type: "string",
      description: "Vehicle registration number.",
      example: "RJ20SP8315",
    },
    engine_number: {
      type: "string",
      description: "Vehicle engine number.",
      example: "HA10EGB9C15553",
    },
    chassis_number: {
      type: "string",
      description: "Vehicle chassis number.",
      example: "MBLHA10AAB9C02425",
    },
    vehicle_type: {
      type: "string",
      description: "Vehicle category.",
      example: "Car",
    },
    make: {
      type: "string",
      description: "Vehicle make/manufacturer.",
      example: "Hero",
    },
    model: {
      type: "string",
      description: "Vehicle model.",
      example: "Splendor",
    },
    manufacturing_year: {
      oneOf: [{ type: "integer" }, { type: "string" }],
      description: "Selected manufacturing year.",
      example: 2021,
    },
    color: { type: "string", description: "Vehicle colour.", example: "Black" },
    recovery_location: {
      type: "string",
      description: "Recovery location.",
      example: "Jaipur",
    },
    recovery_date: {
      type: "string",
      description: "Recovery date.",
      example: "2025-07-13",
    },
    contact_person: {
      type: "string",
      description: "Contact person name.",
      example: "Ravi Kumar",
    },
    contact_number: {
      type: "string",
      description: "Contact person number.",
      example: "9876543210",
    },
    email_address: {
      type: "string",
      format: "email",
      description: "Contact person email ID.",
      example: "ravi@example.com",
    },
    fir_number: {
      type: "string",
      description: "FIR number.",
      example: "123/2025",
    },
    police_station: {
      type: "string",
      description: "Police Station (FIR PS).",
      example: "Civil Lines",
    },
    state: { type: "string", description: "State.", example: "Rajasthan" },
    district: { type: "string", description: "District.", example: "Jaipur" },
    city: { type: "string", description: "City.", example: "Jaipur" },
    fir_date: {
      type: "string",
      description: "FIR date.",
      example: "2025-07-12",
    },
  },
};

module.exports = {
  "/api/stolen-vehicles": {
    get: {
      tags: ["Stolen Vehicles"],
      summary: "Search official stolen vehicles",
      description:
        "Provide commonSearch or one supported search field. When multiple specific fields are supplied, the first supported field in controller order is used. Currently public.",
      parameters: searchParameters,
      responses: {
        200: {
          description: "Matching records",
          content: {
            "application/json": {
              example: {
                success: true,
                status: 1,
                data: [
                  { registration_number: "DL01AB1234", vehicle_type: "Car" },
                ],
              },
            },
          },
        },
        400: {
          description: "Missing or invalid search input",
          content: {
            "application/json": {
              example: {
                success: false,
                message: "At least one search field is required",
              },
            },
          },
        },
        404: {
          description: "No vehicle found",
          content: {
            "application/json": {
              example: { success: false, message: "Vehicle not found" },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/api/customer-stolen-vehicle": {
    post: {
      tags: ["Stolen Vehicles"],
      summary: "Submit a stolen vehicle",
      description:
        "Creates a customer submission after checking official and customer duplicate records. Currently public.",
      requestBody: {
        description:
          "Customer submission fields are JSON request-body fields, not query parameters. Only registration_number is required by the controller.",
        required: true,
        content: {
          "application/json": {
            schema: customerStolenVehicleRequest,
          },
        },
      },
      responses: {
        201: {
          description: "Submitted",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Stolen vehicle submitted successfully",
                data: { id: 42 },
              },
            },
          },
        },
        400: {
          description: "registration_number required",
          content: {
            "application/json": {
              example: {
                success: false,
                message: "registration_number is required",
              },
            },
          },
        },
        409: {
          description: "Duplicate vehicle",
          content: {
            "application/json": {
              example: {
                success: false,
                message: "Vehicle already exists in official stolen records",
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
