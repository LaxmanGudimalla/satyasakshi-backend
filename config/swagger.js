const swaggerJSDoc = require("swagger-jsdoc");
const tags = require("../docs/tags");
const common = require("../docs/schemas/common.schema");
const auth = require("../docs/schemas/auth.schema");
const admin = require("../docs/schemas/admin.schema");
const vehicle = require("../docs/schemas/vehicle.schema");
const challan = require("../docs/schemas/challan.schema");
const stolenVehicle = require("../docs/schemas/stolenVehicle.schema");
const recoveredVehicle = require("../docs/schemas/recoveredVehicle.schema");
const reRegistration = require("../docs/schemas/reRegistration.schema");

const paths = [
  require("../docs/paths/auth.docs"),
  require("../docs/paths/admin.docs"),
  require("../docs/paths/vehicle.docs"),
  require("../docs/paths/challan.docs"),
  require("../docs/paths/stolenVehicle.docs"),
  require("../docs/paths/recoveredVehicle.docs"),
  require("../docs/paths/reRegistration.docs"),
].reduce((all, group) => Object.assign(all, group), {});

module.exports = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Satya Sakshi API",
      version: "1.0.0",
      description:
        "REST API documentation for Satya Sakshi vehicle, challan, and administration services.",
    },
    servers: [
      { url: "http://localhost:8080", description: "Local development" },
      {
        url: "https://satyasakshipoc.spaplc.com",
        description: "Production Development",
      },
    ],
    tags,
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT issued by /api/auth/login.",
        },
      },
      schemas: Object.assign(
        {},
        common,
        auth,
        admin,
        vehicle,
        challan,
        stolenVehicle,
        recoveredVehicle,
        reRegistration,
      ),
      responses: {
        Unauthorized: {
          description: "Missing, malformed, or invalid JWT.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Invalid token" },
            },
          },
        },
        Forbidden: {
          description: "Authenticated user lacks the required role.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Access denied" },
            },
          },
        },
        ServerError: {
          description: "Unexpected server error.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Server error" },
            },
          },
        },
      },
    },
  },
  apis: [],
});
