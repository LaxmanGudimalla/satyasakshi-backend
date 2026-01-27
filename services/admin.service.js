const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.createAdmin = async ({ name, email, password }) => {
  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new Error("Admin already exists");
  }

  const [[adminRole]] = await db.query(
    "SELECT id FROM roles WHERE name = 'ADMIN'"
  );

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (name, email, password, role_id)
     VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, adminRole.id]
  );

  return { name, email };
};

exports.getAdmins = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const [admins] = await db.query(
    `SELECT u.id, u.name, u.email, u.created_at
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE r.name = 'ADMIN'
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) as total
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE r.name = 'ADMIN'`
  );

  return { admins, total };
};

exports.getRecoveredVehiclesCount = async () => {
  const [[{ total }]] = await db.query(
    "SELECT COUNT(*) AS total FROM recovered_vehicles"
  );

  return total;
};

exports.getStolenVehiclesCount = async () => {
  const [[{ total }]] = await db.query(
    "SELECT COUNT(*) AS total FROM stolen_vehicles"
  );

  return total;
};

