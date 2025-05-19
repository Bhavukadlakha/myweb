const Availability = require("../models/Availability");


const setAvailability = async (req, res) => {
  try {
    // Only allow professors
    if (req.user.role !== 'professor') {
      return res.status(403).json({ error: 'Only professors can set availability' });
    }

    // DO NOT look up any student or professor by ID here!
    const { slots } = req.body;
    const availability = await Availability.create({
      professor: req.user.id, // Use the authenticated professor's ID
      slots
    });

    res.status(201).json({ message: 'Availability set', availability });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAvailability = async (req, res) => {
  try {
    // Only allow students
    if (!['student', 'professor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized to view availability' });
    }

    // DO NOT look up any student or professor by ID here!
    const { professorId } = req.params;
    const availability = await Availability.findOne({ professor: professorId });

    if (!availability) {
      return res.status(404).json({ error: 'No availability found for this professor' });
    }

    res.status(200).json({ availability });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { setAvailability, getAvailability };
