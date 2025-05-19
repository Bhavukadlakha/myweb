const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.bookAppointment = async (req, res) => {
  const { professorId, date, time } = req.body;
 
const availability = await Availability.findOne({
  professor: professorId,
  slots: { $elemMatch: { date, time } }
});
if (!availability) return res.status(400).json({ message: "Slot not available" });  

  const appointment = await Appointment.create({
    student: req.user.id,
    professor: professorId,
    date,
    time
  });
  await Availability.updateOne(
    { _id: availability._id },
    { $pull: { slots: { date, time } } }
  );
  res.status(201).json({ appointment });
};

exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  await Appointment.findByIdAndDelete(appointmentId);
  res.status(200).json({ message: "Appointment cancelled" });
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id });
    res.status(200).json({ appointments }); // <-- wrap in object
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  bookAppointment: exports.bookAppointment,
  cancelAppointment: exports.cancelAppointment,
  getMyAppointments: exports.getMyAppointments
};

