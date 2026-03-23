import { Patient, Doctor, Appointment } from './types';

export const seedDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Mitchell', specialization: 'Cardiology', contact: '555-0101', available: true, created_at: '2024-01-15T08:00:00Z' },
  { id: 'd2', name: 'Dr. James Chen', specialization: 'Neurology', contact: '555-0102', available: true, created_at: '2024-01-16T08:00:00Z' },
  { id: 'd3', name: 'Dr. Amara Osei', specialization: 'Pediatrics', contact: '555-0103', available: false, created_at: '2024-01-17T08:00:00Z' },
  { id: 'd4', name: 'Dr. Robert Kim', specialization: 'Orthopedics', contact: '555-0104', available: true, created_at: '2024-01-18T08:00:00Z' },
  { id: 'd5', name: 'Dr. Elena Vasquez', specialization: 'Dermatology', contact: '555-0105', available: true, created_at: '2024-01-19T08:00:00Z' },
];

export const seedPatients: Patient[] = [
  { id: 'p1', name: 'John Smith', age: 45, gender: 'Male', contact: '555-1001', address: '123 Oak St', blood_type: 'A+', emergency_contact: '555-9001', created_at: '2024-02-01T10:00:00Z' },
  { id: 'p2', name: 'Maria Garcia', age: 32, gender: 'Female', contact: '555-1002', address: '456 Pine Ave', blood_type: 'O-', emergency_contact: '555-9002', created_at: '2024-02-02T10:00:00Z' },
  { id: 'p3', name: 'David Johnson', age: 58, gender: 'Male', contact: '555-1003', address: '789 Elm Dr', blood_type: 'B+', emergency_contact: '555-9003', created_at: '2024-02-03T10:00:00Z' },
  { id: 'p4', name: 'Emily Davis', age: 27, gender: 'Female', contact: '555-1004', address: '321 Maple Ln', blood_type: 'AB+', emergency_contact: '555-9004', created_at: '2024-02-04T10:00:00Z' },
  { id: 'p5', name: 'Michael Brown', age: 63, gender: 'Male', contact: '555-1005', address: '654 Cedar Ct', blood_type: 'O+', emergency_contact: '555-9005', created_at: '2024-02-05T10:00:00Z' },
  { id: 'p6', name: 'Sophia Wilson', age: 19, gender: 'Female', contact: '555-1006', address: '987 Birch Rd', blood_type: 'A-', emergency_contact: '555-9006', created_at: '2024-02-06T10:00:00Z' },
  { id: 'p7', name: 'James Taylor', age: 41, gender: 'Male', contact: '555-1007', address: '147 Walnut St', blood_type: 'B-', emergency_contact: '555-9007', created_at: '2024-02-07T10:00:00Z' },
  { id: 'p8', name: 'Olivia Martinez', age: 35, gender: 'Female', contact: '555-1008', address: '258 Spruce Way', blood_type: 'AB-', emergency_contact: '555-9008', created_at: '2024-02-08T10:00:00Z' },
  { id: 'p9', name: 'William Anderson', age: 52, gender: 'Male', contact: '555-1009', address: '369 Ash Blvd', blood_type: 'O+', emergency_contact: '555-9009', created_at: '2024-02-09T10:00:00Z' },
  { id: 'p10', name: 'Ava Thomas', age: 29, gender: 'Female', contact: '555-1010', address: '741 Poplar Dr', blood_type: 'A+', emergency_contact: '555-9010', created_at: '2024-02-10T10:00:00Z' },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const seedAppointments: Appointment[] = [
  { id: 'a1', patient_id: 'p1', doctor_id: 'd1', date: today, time: '09:00', reason: 'Chest pain evaluation', status: 'Scheduled', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a2', patient_id: 'p2', doctor_id: 'd2', date: today, time: '10:00', reason: 'Migraine consultation', status: 'Scheduled', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a3', patient_id: 'p3', doctor_id: 'd1', date: today, time: '11:00', reason: 'Follow-up ECG', status: 'Completed', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a4', patient_id: 'p4', doctor_id: 'd3', date: today, time: '14:00', reason: 'Annual checkup', status: 'Cancelled', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a5', patient_id: 'p5', doctor_id: 'd4', date: today, time: '15:00', reason: 'Knee pain assessment', status: 'Scheduled', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a6', patient_id: 'p6', doctor_id: 'd5', date: tomorrow, time: '09:30', reason: 'Skin rash examination', status: 'Scheduled', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a7', patient_id: 'p7', doctor_id: 'd2', date: tomorrow, time: '10:30', reason: 'Numbness in hands', status: 'Scheduled', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a8', patient_id: 'p8', doctor_id: 'd1', date: '2024-03-18', time: '13:00', reason: 'Blood pressure review', status: 'Completed', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a9', patient_id: 'p9', doctor_id: 'd4', date: '2024-03-19', time: '11:00', reason: 'Hip replacement consult', status: 'Completed', created_at: '2024-03-01T08:00:00Z' },
  { id: 'a10', patient_id: 'p10', doctor_id: 'd5', date: '2024-03-20', time: '16:00', reason: 'Acne treatment follow-up', status: 'Cancelled', created_at: '2024-03-01T08:00:00Z' },
];
