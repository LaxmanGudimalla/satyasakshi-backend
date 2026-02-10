const service = require("../services/superAdmin.service");

/* Pending */

exports.getPendingRecovered = async (req, res) => {
  const data = await service.getPendingRecovered();
  res.json({ success: true, data });
};

exports.getPendingStolen = async (req, res) => {
  const data = await service.getPendingStolen();
  res.json({ success: true, data });
};

/* Approve */

exports.approveRecovered = async (req, res) => {
  await service.approveRecovered(req.params.id);
  res.json({ success: true });
};

exports.approveStolen = async (req, res) => {
  await service.approveStolen(req.params.id);
  res.json({ success: true });
};

/* Reject */

exports.rejectRecovered = async (req, res) => {
  await service.rejectRecovered(req.params.id);
  res.json({ success: true });
};

exports.rejectStolen = async (req, res) => {
  await service.rejectStolen(req.params.id);
  res.json({ success: true });
};
