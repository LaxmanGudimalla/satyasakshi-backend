module.exports = {
  "/api/challans": {
    get: {
      tags: ["Challans"],
      summary: "Get challans by registration number",
      description:
        "Returns grouped challan data for a registration number. Currently public.",
      parameters: [
        {
          name: "registrationNumber",
          in: "query",
          required: true,
          schema: { type: "string" },
          example: "KA05EF9012",
        },
      ],
      responses: {
        200: {
          description: "Challan data or no records",
          content: {
            "application/json": {
              examples: {
                found: {
                  value: {
                    success: true,
                    status: 1,
                    data: {
                      registrationNumber: "KA05EF9012",
                      totalChallanCount: 2,
                      totalValue: 1500,
                      rows: [
                        {
                          srNo: 1,
                          challanNumber: "CHL-2025-001",
                          noOfChallan: 2,
                          totalValue: 1500,
                        },
                      ],
                    },
                    message: "Challan data fetched successfully",
                    dataType: 1,
                  },
                },
                none: {
                  value: {
                    success: false,
                    status: 0,
                    message: "No challans found",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "registrationNumber required",
          content: {
            "application/json": {
              example: {
                success: false,
                message: "Provide registrationNumber",
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
