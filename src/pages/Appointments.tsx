import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHospital } from '@/context/HospitalContext';
import { Appointment } from '@/lib/types';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';

const emptyForm = { patient_id: '', doctor_id: '', date: '', time: '', reason: '', status: 'Scheduled' as const };

export default function Appointments() {
  const { appointments, patients, doctors, addAppointment, updateAppointment, deleteAppointment, getPatient, getDoctor } = useHospital();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'new') setModalOpen(true);
  }, [searchParams]);

  const filtered = appointments.filter(a => {
    const patient = getPatient(a.patient_id);
    const doctor = getDoctor(a.doctor_id);
    const matchSearch = (patient?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (doctor?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      a.date.includes(search);
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (a: Appointment) => { setEditing(a); setForm({ patient_id: a.patient_id, doctor_id: a.doctor_id, date: a.date, time: a.time, reason: a.reason, status: a.status }); setModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient_id || !form.doctor_id || !form.date || !form.time) {
      toast.error('Patient, doctor, date, and time are required');
      return;
    }
    if (editing) {
      updateAppointment(editing.id, form);
      toast.success('Appointment updated');
    } else {
      const error = addAppointment(form);
      if (error) { toast.error(error); return; }
      toast.success('Appointment booked');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Appointments</h1>
          <p className="text-muted-foreground">{appointments.length} total appointments</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Book Appointment
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search by patient, doctor, or date..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
          <option>All</option><option>Scheduled</option><option>Completed</option><option>Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {['Patient','Doctor','Date','Time','Reason','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{getPatient(a.patient_id)?.name ?? 'Unknown'}</td>
                <td className="px-4 py-3">{getDoctor(a.doctor_id)?.name ?? 'Unknown'}</td>
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3">{a.time}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{a.reason}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { deleteAppointment(a.id); toast.success('Appointment deleted'); }} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No appointments found</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold font-display">{editing ? 'Edit Appointment' : 'Book Appointment'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Patient *</label>
                <select value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Doctor *</label>
                <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select doctor</option>
                  {doctors.filter(d => d.available).map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Time *</label>
                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Reason</label>
                <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              {editing && (
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Appointment['status'] })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option>Scheduled</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </div>
              )}
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{editing ? 'Update' : 'Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
