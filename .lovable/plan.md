

## Plan: Generate Flask + SQLite Backend as Downloadable Project

I will generate a complete, standalone Python Flask backend project as a downloadable zip-style folder structure, written to `/mnt/documents/`. The React frontend stays as-is in Lovable.

### What will be generated

A `backend/` folder containing:

```text
backend/
├── app.py              # Main Flask app with all REST endpoints
├── models.py           # SQLAlchemy models (Patient, Doctor, Appointment)
├── seed.py             # Seed data script (5 doctors, 10 patients, 10 appointments)
├── requirements.txt    # Flask, Flask-CORS, Flask-SQLAlchemy
└── README.md           # Setup & run instructions
```

### Endpoints (matching your original spec)

- **Patients**: `GET/POST /api/patients`, `GET/PUT/DELETE /api/patients/<id>`
- **Doctors**: `GET/POST /api/doctors`, `GET/PUT/DELETE /api/doctors/<id>`
- **Appointments**: `GET/POST /api/appointments`, `GET/PUT/DELETE /api/appointments/<id>`
  - POST includes conflict detection (no double-booking)

### Database

- SQLite file (`hospital.db`) auto-created on first run
- 3 tables matching the existing types: `patients`, `doctors`, `appointments`
- Foreign keys from appointments to patients/doctors

### Seed Data

Same data currently in `seed-data.ts`, ported to Python.

### README

Instructions to:
1. `pip install -r requirements.txt`
2. `python seed.py` (optional, loads sample data)
3. `python app.py` (runs on `localhost:5000`)

### Frontend note

The React app in Lovable will remain unchanged (using localStorage). The README will document how to point the frontend at the Flask API if running locally.

### Technical details

- Flask-CORS enabled for cross-origin requests from the React dev server
- SQLAlchemy ORM for clean model definitions
- All responses return JSON with appropriate HTTP status codes
- Conflict detection on appointment creation checks same doctor + date + time

