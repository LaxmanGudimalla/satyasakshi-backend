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

exports.getAdmins = async () => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.created_at
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE r.name = 'ADMIN'`
  );
  return rows;
};
