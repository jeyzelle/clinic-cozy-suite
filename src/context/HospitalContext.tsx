import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Patient, Doctor, Appointment } from '@/lib/types';
import { seedPatients, seedDoctors, seedAppointments } from '@/lib/seed-data';

interface HospitalContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  addPatient: (p: Omit<Patient, 'id' | 'created_at'>) => void;
  updatePatient: (id: string, p: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addDoctor: (d: Omit<Doctor, 'id' | 'created_at'>) => void;
  updateDoctor: (id: string, d: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  addAppointment: (a: Omit<Appointment, 'id' | 'created_at'>) => string | null;
  updateAppointment: (id: string, a: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
  getDoctor: (id: string) => Doctor | undefined;
}

const HospitalContext = createContext<HospitalContextType | null>(null);

function load<T>(key: string, seed: T[]): T[] {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

const uid = () => crypto.randomUUID();

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => load('hms_patients', seedPatients));
  const [doctors, setDoctors] = useState<Doctor[]>(() => load('hms_doctors', seedDoctors));
  const [appointments, setAppointments] = useState<Appointment[]>(() => load('hms_appointments', seedAppointments));

  useEffect(() => localStorage.setItem('hms_patients', JSON.stringify(patients)), [patients]);
  useEffect(() => localStorage.setItem('hms_doctors', JSON.stringify(doctors)), [doctors]);
  useEffect(() => localStorage.setItem('hms_appointments', JSON.stringify(appointments)), [appointments]);

  const addPatient = useCallback((p: Omit<Patient, 'id' | 'created_at'>) => {
    setPatients(prev => [...prev, { ...p, id: uid(), created_at: new Date().toISOString() } as Patient]);
  }, []);

  const updatePatient = useCallback((id: string, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  }, []);

  const addDoctor = useCallback((d: Omit<Doctor, 'id' | 'created_at'>) => {
    setDoctors(prev => [...prev, { ...d, id: uid(), created_at: new Date().toISOString() } as Doctor]);
  }, []);

  const updateDoctor = useCallback((id: string, data: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  }, []);

  const deleteDoctor = useCallback((id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  }, []);

  const addAppointment = useCallback((a: Omit<Appointment, 'id' | 'created_at'>) => {
    // Conflict detection
    const conflict = appointments.find(
      ex => ex.doctor_id === a.doctor_id && ex.date === a.date && ex.time === a.time && ex.status !== 'Cancelled'
    );
    if (conflict) return 'This doctor already has an appointment at this date and time.';
    setAppointments(prev => [...prev, { ...a, id: uid(), created_at: new Date().toISOString() } as Appointment]);
    return null;
  }, [appointments]);

  const updateAppointment = useCallback((id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const getPatient = useCallback((id: string) => patients.find(p => p.id === id), [patients]);
  const getDoctor = useCallback((id: string) => doctors.find(d => d.id === id), [doctors]);

  return (
    <HospitalContext.Provider value={{
      patients, doctors, appointments,
      addPatient, updatePatient, deletePatient,
      addDoctor, updateDoctor, deleteDoctor,
      addAppointment, updateAppointment, deleteAppointment,
      getPatient, getDoctor,
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be used within HospitalProvider');
  return ctx;
}
