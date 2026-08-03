const json = { "application/json": {} };
module.exports = {
  // "/api/auth/register": { post: { tags: ["Authentication"], summary: "Register a user", description: "Creates a non-admin user. ADMIN and SUPER_ADMIN roles are rejected.", requestBody: { required: true, content: { ...json, "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } } }, responses: { 200: { description: "User registered", content: { "application/json": { example: { success: true, user: { name: "Aarav Sharma", email: "aarav@satyasakshi.com", role: "USER" } } } } }, 400: { description: "Invalid role, duplicate account, or database validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" }, example: { success: false, message: "Account already exists" } } } } } } },
  "/api/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Log in",
      description:
        "Uses the same credentials endpoint for all roles. On successful credential validation, it returns a one-day JWT and the user's role. The frontend must use role to route the user to the appropriate dashboard: SUPER_ADMIN (1), ADMIN (2), FIELD_EXECUTIVE (3), or CUSTOMER (4).",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
            examples: {
              superAdminCredentials: {
                summary: "Existing Super Admin test credentials",
                value: {
                  email: "superadmin@satyasakshi.com",
                  password: "1234",
                },
              },
              adminCredentials: {
                summary: "Existing Admin test credentials",
                value: { email: "admin@satyasakshi.com", password: "1234" },
              },
              fieldExecutiveCredentials: {
                summary: "Existing Field Executive test credentials",
                value: { email: "field@satyasakshi.com", password: "1234" },
              },
              customerCredentials: {
                summary: "Existing Customer test credentials",
                value: { email: "customer@satyasakshi.com", password: "1234" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description:
            "Authenticated; use the role in the response for dashboard routing.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
              examples: {
                superAdmin: {
                  summary: "Super Admin",
                  value: {
                    success: true,
                    token: "eyJhbGciOiJIUzI1NiJ9...",
                    role: "SUPER_ADMIN",
                    name: "Sakshi Super Admin",
                  },
                },
                admin: {
                  summary: "Admin",
                  value: {
                    success: true,
                    token: "eyJhbGciOiJIUzI1NiJ9...",
                    role: "ADMIN",
                    name: "Aarav Admin",
                  },
                },
                fieldExecutive: {
                  summary: "Field Executive",
                  value: {
                    success: true,
                    token: "eyJhbGciOiJIUzI1NiJ9...",
                    role: "FIELD_EXECUTIVE",
                    name: "Farah Executive",
                  },
                },
                customer: {
                  summary: "Customer",
                  value: {
                    success: true,
                    token: "eyJhbGciOiJIUzI1NiJ9...",
                    role: "CUSTOMER",
                    name: "Chetan Customer",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Invalid credentials or account does not exist",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Invalid password" },
            },
          },
        },
      },
    },
  },
};
