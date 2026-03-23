export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  blood_type: string;
  emergency_contact: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contact: string;
  available: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  created_at: string;
}
