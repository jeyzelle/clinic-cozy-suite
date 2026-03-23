import { useHospital } from '@/context/HospitalContext';
import { Users, CalendarClock, Stethoscope, UserPlus, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';

export default function Dashboard() {
  const { patients, doctors, appointments, getPatient, getDoctor } = useHospital();
  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === today);
  const availableDocs = doctors.filter(d => d.available);

  const recentAppts = [...appointments].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);

  const cards = [
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-primary' },
    { label: "Today's Appointments", value: todayAppts.length, icon: CalendarClock, color: 'text-status-scheduled' },
    { label: 'Available Doctors', value: availableDocs.length, icon: Stethoscope, color: 'text-status-available' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to MedCore Hospital Management System</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold font-display">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/patients?action=new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <UserPlus className="h-4 w-4" /> Register Patient
        </Link>
        <Link to="/appointments?action=new" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <CalendarPlus className="h-4 w-4" /> Book Appointment
        </Link>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold font-display">Recent Appointments</h2>
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Doctor</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppts.map(a => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{getPatient(a.patient_id)?.name ?? 'Unknown'}</td>
                  <td className="px-4 py-3">{getDoctor(a.doctor_id)?.name ?? 'Unknown'}</td>
                  <td className="px-4 py-3">{a.date} {a.time}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
