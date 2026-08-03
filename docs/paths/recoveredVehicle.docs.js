const searchParameters = [
  {
    name: "commonSearch",
    in: "query",
    description:
      "Exact identifier or 10-character first-six+last-four, or last 5/6 identifier characters.",
    schema: { type: "string" },
    example: "07K03C6342",
  },
  {
    name: "registration_number",
    in: "query",
    schema: { type: "string" },
    example: "DL9SR6342",
  },
  {
    name: "chassis_number",
    in: "query",
    schema: { type: "string" },
    example: "07K03C14786",
  },
  {
    name: "engine_number",
    in: "query",
    schema: { type: "string" },
    example: "07K15M08761",
  },
  {
    name: "chassis6_reg4",
    in: "query",
    description:
      "Exactly 10 characters: first 6 chassis characters + last 4 registration characters.",
    schema: { type: "string", minLength: 10, maxLength: 10 },
    example: "07K03C6342",
  },
  {
    name: "engine6_reg4",
    in: "query",
    description:
      "Exactly 10 characters: first 6 engine characters + last 4 registration characters.",
    schema: { type: "string", minLength: 10, maxLength: 10 },
    example: "07K15M6342",
  },
  {
    name: "engine_or_chassis_last5",
    in: "query",
    description: "Use 14786 (chassis) or 08761 (engine).",
    schema: { type: "string", minLength: 5, maxLength: 5 },
    example: "14786",
  },
  {
    name: "engine_or_chassis_last6",
    in: "query",
    description: "Use C14786 (chassis) or M08761 (engine).",
    schema: { type: "string", minLength: 6, maxLength: 6 },
    example: "C14786",
  },
];

const customerRecoveredVehicleRequest = {
  type: "object",
  description:
    "Customer recovered-vehicle submission. All fields are sent in the JSON request body. registration_number is the only field required by the controller.",
  required: ["registration_number"],
  properties: {
    case_status: {
      type: "string",
      description: "Recovery case status.",
      example: "Recovered",
    },
    registration_number: {
      type: "string",
      description: "Vehicle registration number.",
      example: "DL9SR6342",
    },
    engine_number: {
      type: "string",
      description: "Vehicle engine number.",
      example: "07K15M08761",
    },
    chassis_number: {
      type: "string",
      description: "Vehicle chassis number.",
      example: "07K03C14786",
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
    model: { type: "string", description: "Vehicle model.", example: "Swift" },
    manufacturing_year: {
      oneOf: [{ type: "integer" }, { type: "string" }],
      description: "Year of manufacture.",
      example: 2021,
    },
    color: { type: "string", description: "Vehicle colour.", example: "White" },
    recovery_location: {
      type: "string",
      description: "Location of recovery.",
      example: "Kashmere Gate",
    },
    recovery_date: {
      type: "string",
      description: "Date of recovery.",
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
      description: "Police station handling the recovery.",
      example: "Civil Lines",
    },
    state: { type: "string", description: "State.", example: "Delhi" },
    districts: {
      type: "string",
      description: "District.",
      example: "North Delhi",
    },
    city: { type: "string", description: "City.", example: "Delhi" },
    fir_date: {
      type: "string",
      description: "FIR date.",
      example: "2025-07-12",
    },
  },
};

module.exports = {
  "/api/recovered-vehicle": {
    post: {
      tags: ["Recovered Vehicles"],
      summary: "Submit a recovered vehicle",
      description:
        "Creates a customer recovered-vehicle submission after duplicate checking. Currently public.",
      requestBody: {
        description:
          "Customer submission fields are JSON request-body fields, not query parameters. Only registration_number is required by the controller.",
        required: true,
        content: {
          "application/json": {
            schema: customerRecoveredVehicleRequest,
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
                status: 1,
                message: "Recovered vehicle added successfully",
                data: { recoveredVehicleId: 42 },
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
                message: "Vehicle already submitted by another customer",
                errors: {
                  registration_number: "Registration number already exists",
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    get: {
      tags: ["Recovered Vehicles"],
      summary: "Search official recovered vehicles",
      description:
        "Provide commonSearch or one supported search field. Currently public.",
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
  "/api/sync-recovered": {
    get: {
      tags: ["Recovered Vehicles"],
      summary: "Synchronize recovered ZIPNET data",
      description:
        "Fetches every page from ZIPNET and upserts mapped recovered records. This can be long-running and is currently public.",
      responses: {
        200: {
          description: "Sync completed",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Full sync completed successfully",
                total_records: 250,
              },
            },
          },
        },
        500: {
          description: "Sync failed",
          content: {
            "application/json": {
              example: { success: false, message: "Sync failed" },
            },
          },
        },
      },
    },
  },
};
