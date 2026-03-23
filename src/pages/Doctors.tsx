import { useState } from 'react';
import { useHospital } from '@/context/HospitalContext';
import { Doctor } from '@/lib/types';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';

const emptyForm = { name: '', specialization: '', contact: '', available: true };

export default function Doctors() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useHospital();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d: Doctor) => { setEditing(d); setForm({ name: d.name, specialization: d.specialization, contact: d.contact, available: d.available }); setModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialization) { toast.error('Name and specialization are required'); return; }
    if (editing) {
      updateDoctor(editing.id, form);
      toast.success('Doctor updated');
    } else {
      addDoctor(form);
      toast.success('Doctor added');
    }
    setModalOpen(false);
  };

  const toggleAvailability = (d: Doctor) => {
    updateDoctor(d.id, { available: !d.available });
    toast.success(`${d.name} is now ${d.available ? 'unavailable' : 'available'}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Doctors</h1>
          <p className="text-muted-foreground">{doctors.length} doctors on staff</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Doctor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {['Name','Specialization','Contact','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3">{d.specialization}</td>
                <td className="px-4 py-3">{d.contact}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleAvailability(d)}>
                    <StatusBadge status={d.available ? 'available' : 'unavailable'} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(d)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { deleteDoctor(d.id); toast.success('Doctor deleted'); }} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No doctors found</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold font-display">{editing ? 'Edit Doctor' : 'Add Doctor'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Specialization *</label>
                <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Contact</label>
                <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="h-4 w-4 rounded border accent-primary" />
                <label className="text-sm font-medium">Available</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
