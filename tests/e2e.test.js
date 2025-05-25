// 
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const expect = require('chai').expect;

let studentToken = '';
let studentId = '';
let profToken = '';
let profId = '';
let appointmentId = '';
let student2Token = '';

describe('College Appointment E2E Flow', function() {
  this.timeout(10000); 

  before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/collegeappt');
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('Register Student A1', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'BHAVUK',
      email: 'BHAVUK1@example.com',
      password: 'BHAVUKPass1',
      role: 'student'
    });
    console.log('Register Student A1:', res.status, res.body);
    expect(res.status).to.equal(201);
  });
  

  it('Login Student A1', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'BHAVUK1@example.com',
      password: 'BHAVUKPass1'
    });
    studentToken = res.body.token;
    studentId = res.body.user._id;
    expect(res.status).to.equal(200);
  });

  it('Register Professor P1', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'HONEY',
      email: 'HONEY.prof@example.com',
      password: 'HONEYProfPass',
      role: 'professor'
    });
    expect(res.status).to.equal(201);
  });

  it('Login Professor P1', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'HONEY.prof@example.com',
      password: 'HONEYProfPass'
    });
    profToken = res.body.token;
    profId = res.body.user._id;
    expect(res.status).to.equal(200);
  });

  it('Professor P1 sets availability', async () => {
    const res = await request(app)
      .post('/api/availability')
      .set('Authorization', `Bearer ${profToken}`)
      .send({
        slots: [
          { date: '2025-05-15', time: '10:00' },
          { date: '2025-05-15', time: '11:00' }
        ]
      });
    expect(res.status).to.equal(201);
  });

  it('Student A1 views available slots', async () => {
    const res = await request(app)
      .get(`/api/availability/${profId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).to.equal(200);
  });

  it('Student A1 books appointment at 10:00', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        professorId: profId,
        date: '2025-05-15',
        time: '10:00'
      });
    appointmentId = res.body.appointment._id; 
    console.log('Created appointment:', res.body.appointment); 
    expect(res.status).to.equal(201);
  });

  it('Student A2 registers & books at 11:00', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'MAYRA',
      email: 'MAYRA2@example.com',
      password: 'MAYRAPass2',
      role: 'student'
    });

    const login = await request(app).post('/api/auth/login').send({
      email: 'MAYRA2@example.com',
      password: 'MAYRAPass2'
    });
    student2Token = login.body.token;

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        professorId: profId, 
        date: '2025-05-15',
        time: '11:00'
      });

    console.log('Booked appointment:', res.body.appointment); 
    expect(res.status).to.equal(201);
  });

  it('Student A2 checks their appointments', async () => {
    const res = await request(app)
      .get('/api/appointments/me')
      .set('Authorization', `Bearer ${student2Token}`);
    console.log('Fetched appointments for A2:', res.body.appointments);
    expect(res.body.appointments.length).to.equal(1);
    
    expect(res.body.appointments[0].professor).to.equal(profId);
    expect(res.body.appointments[0].date).to.equal('2025-05-15');
    expect(res.body.appointments[0].time).to.equal('11:00');
  });

 it('Student A1 cancels their appointment', async () => {
  const res = await request(app)
    .delete(`/api/appointments/${appointmentId}`)
    .set('Authorization', `Bearer ${studentToken}`);
  expect(res.status).to.equal(200);
});

  it('Student A1 checks their appointments', async () => {
    const res = await request(app)
      .get('/api/appointments/me')
      .set('Authorization', `Bearer ${studentToken}`);
    console.log('Fetched appointments for A1:', res.body.appointments);
    expect(res.body.appointments.length).to.equal(0);
  });

  it('Student A2 books the freed 10:00 slot', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${student2Token}`)
      .send({
        professorId: profId,
        date: '2025-05-15',
        time: '10:00'
      });
    console.log('A2 booked freed slot:', res.body.appointment);
    expect(res.status).to.equal(201);
  });
});