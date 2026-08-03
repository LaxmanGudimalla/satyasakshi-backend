module.exports = {
  "/api/save-vehicle": {
    post: {
      tags: ["Vehicles"],
      summary: "Save vehicle service history",
      description: "Stores the supplied nested vehicle data. Currently public.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SaveVehicleRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Stored",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Vehicle data inserted successfully",
                insertedId: 42,
              },
            },
          },
        },
        400: {
          description: "Missing data wrapper",
          content: {
            "application/json": { example: { message: "Invalid JSON data" } },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/api/search-vehicle": {
    get: {
      tags: ["Vehicles"],
      summary: "Search vehicle service history",
      description:
        "Supply at least one query key; matching uses OR logic. Currently public.",
      parameters: [
        {
          name: "registration_number",
          in: "query",
          schema: { type: "string" },
          example: "MH12RT9183",
        },
        {
          name: "chassis_number",
          in: "query",
          schema: { type: "string" },
          example: "MA3EUA12S009183",
        },
        {
          name: "engine_number",
          in: "query",
          schema: { type: "string" },
          example: "K15BNM9183P",
        },
      ],
      responses: {
        200: {
          description: "Vehicle found or no matching vehicle",
          content: {
            "application/json": {
              examples: {
                found: {
                  value: {
                    success: true,
                    data: {
                      registration_number: "MH12RT9183",
                      colour: "White",
                    },
                  },
                },
                notFound: {
                  value: { success: false, message: "Vehicle not found" },
                },
              },
            },
          },
        },
        400: {
          description: "No search field",
          content: {
            "application/json": {
              example: {
                message: "Enter Registration OR Chassis OR Engine Number",
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
