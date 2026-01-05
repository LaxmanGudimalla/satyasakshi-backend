const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async ({ name, email, password, role }) => {

  // 🔴 BLOCK ADMIN & SUPER ADMIN creation from signup
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    throw new Error("You are not allowed to create this role");
  }

  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new Error("Account already exists");
  }

  const [[roleData]] = await db.query(
    "SELECT id FROM roles WHERE name = ?",
    [role]
  );

  if (!roleData) {
    throw new Error("Invalid role");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (name, email, password, role_id)
     VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, roleData.id]
  );

  return { name, email, role };
};

exports.loginUser = async ({ email, password }) => {
  const [rows] = await db.query(
    `SELECT u.*, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = ?`,
    [email]
  );

  // 🔴 Account does not exist
  if (rows.length === 0) {
    throw new Error("Account doesn't exist");
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  // 🔴 Password incorrect
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  return {
    token,
    role: user.role,
    name: user.name
  };
};

