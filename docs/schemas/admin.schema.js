module.exports = {
  CreateAdminRequest: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string", example: "Priya Admin" },
      email: {
        type: "string",
        format: "email",
        example: "priya.admin@satyasakshi.com",
      },
      password: { type: "string", format: "password", example: "password123" },
    },
  },
  Admin: {
    type: "object",
    properties: {
      id: { $ref: "#/components/schemas/Id" },
      name: { type: "string", example: "Priya Admin" },
      email: {
        type: "string",
        format: "email",
        example: "priya.admin@satyasakshi.com",
      },
      created_at: { type: "string", format: "date-time" },
    },
  },
};
