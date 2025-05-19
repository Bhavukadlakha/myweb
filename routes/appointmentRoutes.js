const express = require("express");
const { auth, authorizeRoles } = require("../middleware/auth");
const {
  bookAppointment,
  cancelAppointment,
  getMyAppointments
} = require("../controllers/appointmentcontroller");

const router = express.Router();

router.post("/", auth, authorizeRoles("student"), bookAppointment);
router.delete("/:appointmentId", auth, authorizeRoles("professor"), cancelAppointment);
router.get("/me", auth, authorizeRoles("student"), getMyAppointments);

module.exports = router;
