const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authController = require('./controllers/authcontroller'); 


const app = express();
app.use(express.json());


app.post('/api/auth/register', authController.registerStudent);
app.post('/api/auth/login', authController.loginUser);


app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  console.log('Root route hit');
  res.send('API is running!');
});

app.get('/test', (req, res) => {
  res.send('Test route works!');
});

console.log('App.js loaded');

module.exports = app;