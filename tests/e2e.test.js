// tests/e2e.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const expect = require('chai').expect;

let studentToken = '';
let studentId = '';
let profToken = '';
let profId = '';
let appointmentId = '';

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
      name: 'Alice',
      email: 'alice1@example.com',
      password: 'alicePass1',
      role: 'student'
    });
    expect(res.status).to.equal(201);
  });

  it('Login Student A1', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'alice1@example.com',
      password: 'alicePass1'
    });
    studentToken = res.body.token;
    studentId = res.body.user._id;
    expect(res.status).to.equal(200);
  });

  it('Register Professor P1', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Dr. Bob',
      email: 'bob.prof@example.com',
      password: 'bobProfPass',
      role: 'professor'
    });
    expect(res.status).to.equal(201);
  });

  it('Login Professor P1', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'bob.prof@example.com',
      password: 'bobProfPass'
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
    appointmentId = res.body.appointment._id; // <-- use _id
    expect(res.status).to.equal(201);
  });

  it('Student A2 registers & books at 11:00', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Charlie',
      email: 'charlie2@example.com',
      password: 'charliePass2',
      role: 'student'
    });

    const login = await request(app).post('/api/auth/login').send({
      email: 'charlie2@example.com',
      password: 'charliePass2'
    });

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        professorId: profId, // <-- use professorId
        date: '2025-05-15',
        time: '11:00'
      });

    expect(res.status).to.equal(201);
  });

  it('Professor P1 cancels appointment with A1', async () => {
    const res = await request(app)
      .delete(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${profToken}`);
    expect(res.status).to.equal(200);
  });

  it('Student A1 checks their appointments', async () => {
    const res = await request(app)
      .get('/api/appointments/me')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.body.appointments.length).to.equal(0);
  });
});
