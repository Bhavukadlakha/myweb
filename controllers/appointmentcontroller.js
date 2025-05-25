const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.bookAppointment = async (req, res) => {
  const { professorId, date, time } = req.body; 
  console.log('Booking for student:', req.user.id);
 
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
  const appointment = await Appointment.findById(appointmentId);

  if (
    appointment &&
    (appointment.student.toString() === req.user.id ||
     appointment.professor.toString() === req.user.id)
  ) {
    const { professor, date, time, student } = appointment;

    await Appointment.findByIdAndDelete(appointmentId);

    
    if (appointment.student.toString() === req.user.id) {
      await Availability.updateOne(
        { professor, "slots.date": { $ne: date }, "slots.time": { $ne: time } },
        { $push: { slots: { date, time } } },
        { upsert: true }
      );
    }
    

    return res.status(200).json({ message: "Appointment cancelled" });
  } else {
    return res.status(403).json({ message: "Not authorized to cancel this appointment" });
  }
};

exports.getMyAppointments = async (req, res) => {
  try { 
     console.log('Fetching appointments for:', req.user.id);
    const appointments = await Appointment.find({ student: req.user.id }); 
    console.log('Fetched appointments:', appointments);
    res.status(200).json({ appointments }); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  bookAppointment: exports.bookAppointment,
  cancelAppointment: exports.cancelAppointment,
  getMyAppointments: exports.getMyAppointments
};

