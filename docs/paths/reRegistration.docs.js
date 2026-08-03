module.exports = {
  "/api/re-registration": {
    get: {
      tags: ["Re-Registration"],
      summary: "Look up re-registration data",
      description:
        "Searches using any supplied registration, chassis, or engine number. Currently public; with no parameters the current SQL is invalid, so supply one.",
      parameters: [
        {
          name: "registrationNumber",
          in: "query",
          schema: { type: "string" },
          example: "GJ19AB1234",
        },
        {
          name: "chassisNumber",
          in: "query",
          schema: { type: "string" },
          example: "CHASSIS001",
        },
        {
          name: "engineNumber",
          in: "query",
          schema: { type: "string" },
          example: "ENGINE001",
        },
      ],
      responses: {
        200: {
          description: "Lookup result",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReRegistrationResponse" },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
