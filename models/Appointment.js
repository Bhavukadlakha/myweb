const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    date: String,
    time: String
});

module.exports = mongoose.model("Appointment", appointmentSchema);
