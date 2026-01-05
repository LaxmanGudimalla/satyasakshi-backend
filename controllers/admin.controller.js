const adminService = require("../services/admin.service");

exports.createAdmin = async (req, res) => {

    const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const admin = await adminService.createAdmin(req.body);
    res.json({ success: true, admin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.listAdmins = async (req, res) => {
  const admins = await adminService.getAdmins();
  res.json({ success: true, admins });
};
