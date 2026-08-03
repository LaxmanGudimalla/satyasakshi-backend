module.exports = {
  RegisterRequest: {
    type: "object",
    required: ["name", "email", "password", "role"],
    properties: {
      name: { type: "string", example: "Aarav Sharma" },
      email: { type: "string", format: "email", example: "aarav@satyasakshi.com" },
      password: { type: "string", format: "password", example: "password123" },
      role: {
        type: "string",
        example: "USER",
        description:
          "Must be an existing role and cannot be ADMIN or SUPER_ADMIN.",
      },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "admin@satyasakshi.com" },
      password: { type: "string", format: "password", example: "password123" },
    },
  },
  Role: {
    type: "string",
    enum: ["SUPER_ADMIN", "ADMIN", "FIELD_EXECUTIVE", "CUSTOMER"],
    description:
      "Role returned from the roles table. Role mapping: SUPER_ADMIN = 1, ADMIN = 2, FIELD_EXECUTIVE = 3, CUSTOMER = 4.",
    example: "ADMIN",
  },
  AuthResponse: {
    type: "object",
    required: ["success", "token", "role", "name"],
    properties: {
      success: { type: "boolean", example: true },
      token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      role: { $ref: "#/components/schemas/Role" },
      name: { type: "string", example: "Aarav Sharma" },
    },
  },
};
