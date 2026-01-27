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
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { admins, total } = await adminService.getAdmins({ page, limit });

    res.json({
      success: true,
      admins,
      total,
      page,
      limit
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins"
    });
  }
};

exports.getRecoveredVehiclesCount = async (req, res) => {
  try {
    const total = await adminService.getRecoveredVehiclesCount();

    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error("Recovered count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recovered vehicles count"
    });
  }
};

exports.getStolenVehiclesCount = async (req, res) => {
  try {
    const total = await adminService.getStolenVehiclesCount();

    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error("Stolen count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stolen vehicles count"
    });
  }
};
