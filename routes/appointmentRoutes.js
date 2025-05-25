const express = require("express");
const { auth, authorizeRoles } = require("../middleware/auth");
const {
  bookAppointment,
  cancelAppointment,
  getMyAppointments
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", auth, authorizeRoles("student"), bookAppointment);
router.delete("/:appointmentId", auth, cancelAppointment);
router.get("/me", auth, authorizeRoles("student"), getMyAppointments);
router.get("/", auth, authorizeRoles("student"), getMyAppointments); 

module.exports = router;
