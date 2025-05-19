const jwt = require('jsonwebtoken');
const Student = require('../models/Student'); 


const checkProfessorPassword = async (email, password) => {
  const professor = await Student.findOne({ email, role: 'professor' });
  if (!professor) return false;
  return await professor.comparePassword(password);
};

const registerStudent = async (req, res) => {
  console.log('Register request body:', req.body);
  try {
    const { name, email, password, role } = req.body;
    const student = await Student.create({ name, email, password, role });
    res.status(201).json({ message: 'Registration successful', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ message: 'Login successful', user: student, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerStudent, loginUser, checkProfessorPassword };