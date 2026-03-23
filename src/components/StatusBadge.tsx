import { cn } from '@/lib/utils';

type StatusType = 'available' | 'unavailable' | 'Scheduled' | 'Completed' | 'Cancelled';

const styles: Record<string, string> = {
  available: 'bg-status-available-bg text-status-available',
  unavailable: 'bg-status-cancelled-bg text-status-cancelled',
  Scheduled: 'bg-status-scheduled-bg text-status-scheduled',
  Completed: 'bg-status-completed-bg text-status-completed',
  Cancelled: 'bg-status-cancelled-bg text-status-cancelled',
};

export function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', styles[status] || '', className)}>
      {status === 'available' ? 'Available' : status === 'unavailable' ? 'Unavailable' : status}
    </span>
  );
}
