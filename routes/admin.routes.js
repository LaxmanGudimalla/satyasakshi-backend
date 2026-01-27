const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken, allowRoles } = require("../middleware/auth.middleware");

router.post(
  "/admins",
  verifyToken,
  allowRoles("SUPER_ADMIN"),
  adminController.createAdmin
);

router.get(
  "/admins",
  verifyToken,
  allowRoles("SUPER_ADMIN"),
  adminController.listAdmins
);

router.get(
  "/admin/recovered/count",
  verifyToken,
  allowRoles("ADMIN"),
  adminController.getRecoveredVehiclesCount
);

router.get(
  "/admin/stolen/count",
  verifyToken,
  allowRoles("ADMIN"),
  adminController.getStolenVehiclesCount
);


module.exports = router;
