const express = require("express");
const { auth, authorizeRoles } = require("../middleware/auth");
const { setAvailability, getAvailability } = require("../controllers/availabilitycontroller");

const router = express.Router();

router.post("/", auth, authorizeRoles("professor"), setAvailability);
router.get("/:professorId", auth, getAvailability);

module.exports = router;
