# College Appointment Booking System

This project is a Node.js/Express/MongoDB-based API for managing college appointment bookings between students and professors. It includes authentication, role-based access, availability management, appointment booking/cancellation, and a full end-to-end automated test suite.

---

## Main Codebase Structure

```
/controllers
  - authController.js         # Handles registration and login
  - availabilityController.js # Handles professor availability slots
  - appointmentController.js  # Handles booking, cancellation, and fetching appointments

/models
  - Student.js                # User model (students and professors)
  - Availability.js           # Professor's available slots
  - Appointment.js            # Booked appointments

/routes
  - authRoutes.js             # Auth endpoints
  - availabilityRoutes.js     # Availability endpoints
  - appointmentRoutes.js      # Appointment endpoints

/tests
  - e2e.test.js               # End-to-end test suite

/app.js                       # Express app setup
/server.js                    # Server entry point
/.env                         # Environment variables
```

---

## Database Structure

### Student (User) Model
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (`student` or `professor`)

### Availability Model
- `_id`: ObjectId
- `professor`: ObjectId (ref: Student)
- `slots`: Array of `{ date: String, time: String, _id: ObjectId }`

### Appointment Model
- `_id`: ObjectId
- `student`: ObjectId (ref: Student)
- `professor`: ObjectId (ref: Student)
- `date`: String
- `time`: String

---

## Main API Endpoints

- `POST /api/auth/register` — Register as student or professor
- `POST /api/auth/login` — Login and receive JWT token
- `POST /api/availability` — (Professor) Set available slots (auth required)
- `GET /api/availability/:professorId` — (Student) View professor's slots (auth required)
- `POST /api/appointments` — (Student) Book an appointment (auth required)
- `GET /api/appointments/me` — (Student) View own appointments (auth required)
- `DELETE /api/appointments/:appointmentId` — (Professor) Cancel an appointment (auth required)

---

## Automated E2E Test Case

The `tests/e2e.test.js` file covers the following flow:

1. **Student A1 registers and logs in**
2. **Professor P1 registers and logs in**
3. **Professor P1 sets two available slots**
4. **Student A1 views P1's available slots**
5. **Student A1 books the first slot**
6. **Student A2 registers, logs in, and books the second slot**
7. **Student A2 checks their appointment (should see one)**
8. **Professor P1 cancels A1's appointment**
9. **Student A1 checks their appointments (should see none)**

All API requests in the test use the correct JWT tokens for authentication and role-based access.

---

## Running the Project

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Set up your `.env` file:**
   ```
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/collegeappt
   JWT_SECRET=your_secret
   ```

3. **Start the server:**
   ```
   node server.js
   ```

4. **Run the automated tests:**
   ```
   npx mocha tests/e2e.test.js
   ```

---

## Notes

- All protected endpoints require the `Authorization: Bearer <token>` header.
- The test database is dropped after each test run for isolation.
- The codebase is modular and easy to extend for more features (e.g., notifications, admin roles, etc).

---
```# College Appointment Booking System

This project is a Node.js/Express/MongoDB-based API for managing college appointment bookings between students and professors. It includes authentication, role-based access, availability management, appointment booking/cancellation, and a full end-to-end automated test suite.

---

## Main Codebase Structure

```
/controllers
  - authController.js         # Handles registration and login
  - availabilityController.js # Handles professor availability slots
  - appointmentController.js  # Handles booking, cancellation, and fetching appointments

/models
  - Student.js                # User model (students and professors)
  - Availability.js           # Professor's available slots
  - Appointment.js            # Booked appointments

/routes
  - authRoutes.js             # Auth endpoints
  - availabilityRoutes.js     # Availability endpoints
  - appointmentRoutes.js      # Appointment endpoints

/tests
  - e2e.test.js               # End-to-end test suite

/app.js                       # Express app setup
/server.js                    # Server entry point
/.env                         # Environment variables
```

---

## Database Structure

### Student (User) Model
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (`student` or `professor`)

### Availability Model
- `_id`: ObjectId
- `professor`: ObjectId (ref: Student)
- `slots`: Array of `{ date: String, time: String, _id: ObjectId }`

### Appointment Model
- `_id`: ObjectId
- `student`: ObjectId (ref: Student)
- `professor`: ObjectId (ref: Student)
- `date`: String
- `time`: String

---

## Main API Endpoints

- `POST /api/auth/register` — Register as student or professor
- `POST /api/auth/login` — Login and receive JWT token
- `POST /api/availability` — (Professor) Set available slots (auth required)
- `GET /api/availability/:professorId` — (Student) View professor's slots (auth required)
- `POST /api/appointments` — (Student) Book an appointment (auth required)
- `GET /api/appointments/me` — (Student) View own appointments (auth required)
- `DELETE /api/appointments/:appointmentId` — (Professor) Cancel an appointment (auth required)

---

## Automated E2E Test Case

The `tests/e2e.test.js` file covers the following flow:

1. **Student A1 registers and logs in**
2. **Professor P1 registers and logs in**
3. **Professor P1 sets two available slots**
4. **Student A1 views P1's available slots**
5. **Student A1 books the first slot**
6. **Student A2 registers, logs in, and books the second slot**
7. **Student A2 checks their appointment (should see one)**
8. **Professor P1 cancels A1's appointment**
9. **Student A1 checks their appointments (should see none)**

All API requests in the test use the correct JWT tokens for authentication and role-based access.

---

## Running the Project

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Set up your `.env` file:**
   ```
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/collegeappt
   JWT_SECRET=your_secret
   ```

3. **Start the server:**
   ```
   node server.js
   ```

4. **Run the automated tests:**
   ```
   npx mocha tests/e2e.test.js
   ```

---

## Notes

- All protected endpoints require the `Authorization: Bearer <token>` header.
- The test database dropped after each test run for isolation.
- The codebase is modular and easy to extend for more features (e.g., notifications, admin roles, etc).

---
