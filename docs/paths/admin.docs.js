const auth = [{ bearerAuth: [] }];
const error = {
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};
module.exports = {
  "/api/admins": {
    post: {
      tags: ["Super Admin"],
      summary: "Create an admin",
      description: "Requires SUPER_ADMIN role.",
      security: auth,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateAdminRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Admin created",
          content: {
            "application/json": {
              example: {
                success: true,
                admin: {
                  name: "Priya Admin",
                  email: "priya.admin@satyasakshi.com",
                },
              },
            },
          },
        },
        400: { description: "Missing fields or duplicate admin", ...error },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
    get: {
      tags: ["Super Admin"],
      summary: "List admins",
      description: "Requires SUPER_ADMIN role.",
      security: auth,
      parameters: [
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          example: 1,
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
          example: 10,
        },
      ],
      responses: {
        200: {
          description: "Paginated admin list",
          content: {
            "application/json": {
              example: {
                success: true,
                admins: [
                  {
                    id: 1,
                    name: "Priya Admin",
                    email: "priya.admin@satyasakshi.com",
                    created_at: "2025-07-01T10:00:00.000Z",
                  },
                ],
                total: 1,
                page: 1,
                limit: 10,
              },
            },
          },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/api/admin/recovered/count": {
    get: {
      tags: ["Admin"],
      summary: "Count recovered vehicles",
      description: "Requires ADMIN role.",
      security: auth,
      responses: {
        200: {
          description: "Recovered vehicle total",
          content: {
            "application/json": { example: { success: true, total: 125 } },
          },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/api/admin/stolen/count": {
    get: {
      tags: ["Admin"],
      summary: "Count stolen vehicles",
      description: "Requires ADMIN role.",
      security: auth,
      responses: {
        200: {
          description: "Stolen vehicle total",
          content: {
            "application/json": { example: { success: true, total: 89 } },
          },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  /* Unused super-admin routes: intentionally omitted from Swagger UI.  */
  "/api/super-admin/pending-recovered": { get: { tags: ["Super Admin"], summary: "List pending recovered submissions" } },
  "/api/super-admin/pending-stolen": { get: { tags: ["Super Admin"], summary: "List pending stolen submissions", description: "Currently public in the application.", responses: { 200: { description: "Pending records", content: { "application/json": { example: { success: true, data: [] } } } } } } },
  "/api/super-admin/approve-recovered/{id}": { post: { tags: ["Super Admin"], summary: "Approve recovered submission", description: "Moves a customer submission to official recovered records; currently public.", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, example: 42 }], responses: { 200: { description: "Approved", content: { "application/json": { example: { success: true } } } }, 500: { $ref: "#/components/responses/ServerError" } } } },
  "/api/super-admin/approve-stolen/{id}": { post: { tags: ["Super Admin"], summary: "Approve stolen submission", description: "Moves a customer submission to official stolen records; currently public.", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, example: 42 }], responses: { 200: { description: "Approved", content: { "application/json": { example: { success: true } } } }, 500: { $ref: "#/components/responses/ServerError" } } } },
  "/api/super-admin/reject-recovered/{id}": { delete: { tags: ["Super Admin"], summary: "Reject recovered submission", description: "Deletes a customer recovered submission; currently public.", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, example: 42 }], responses: { 200: { description: "Rejected", content: { "application/json": { example: { success: true } } } }, 500: { $ref: "#/components/responses/ServerError" } } } },
  "/api/super-admin/reject-stolen/{id}": { delete: { tags: ["Super Admin"], summary: "Reject stolen submission", description: "Deletes a customer stolen submission; currently public.", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, example: 42 }], responses: { 200: { description: "Rejected", content: { "application/json": { example: { success: true } } } }, 500: { $ref: "#/components/responses/ServerError" } } } }

};
