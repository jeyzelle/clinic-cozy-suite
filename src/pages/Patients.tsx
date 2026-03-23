import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHospital } from '@/context/HospitalContext';
import { Patient } from '@/lib/types';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { name: '', age: 0, gender: 'Male', contact: '', address: '', blood_type: '', emergency_contact: '' };

export default function Patients() {
  const { patients, addPatient, updatePatient, deletePatient } = useHospital();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'new') setModalOpen(true);
  }, [searchParams]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact.includes(search) ||
    p.blood_type.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: Patient) => { setEditing(p); setForm({ name: p.name, age: p.age, gender: p.gender, contact: p.contact, address: p.address, blood_type: p.blood_type, emergency_contact: p.emergency_contact }); setModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact) { toast.error('Name and contact are required'); return; }
    if (editing) {
      updatePatient(editing.id, form);
      toast.success('Patient updated');
    } else {
      addPatient({ ...form, age: Number(form.age) });
      toast.success('Patient registered');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deletePatient(id);
    toast.success('Patient deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Patients</h1>
          <p className="text-muted-foreground">{patients.length} registered patients</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Register Patient
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search by name, contact, or blood type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {['Name','Age','Gender','Contact','Blood Type','Address','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.age}</td>
                <td className="px-4 py-3">{p.gender}</td>
                <td className="px-4 py-3">{p.contact}</td>
                <td className="px-4 py-3"><span className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">{p.blood_type}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{p.address}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No patients found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold font-display">{editing ? 'Edit Patient' : 'Register Patient'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Age</label>
                <input type="number" value={form.age || ''} onChange={e => setForm({ ...form, age: Number(e.target.value) })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Gender</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Contact *</label>
                <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Blood Type</label>
                <input value={form.blood_type} onChange={e => setForm({ ...form, blood_type: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Emergency Contact</label>
                <input value={form.emergency_contact} onChange={e => setForm({ ...form, emergency_contact: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{editing ? 'Update' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
