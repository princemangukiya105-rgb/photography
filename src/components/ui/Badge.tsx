import { BookingStatus } from '@/types/database';
import React from 'react';

interface BadgeProps {
  status: BookingStatus | string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: BadgeProps) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    confirmed: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    rescheduled: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    cancelled: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
    rejected: 'bg-zinc-900 text-zinc-400 border-zinc-700',
    completed: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    new: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    contacted: 'bg-teal-950/60 text-teal-300 border-teal-800/60',
    archived: 'bg-zinc-900 text-zinc-500 border-zinc-800',
  };

  const currentStyle = styles[status.toLowerCase()] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium uppercase tracking-wider rounded-full border ${sizeClasses} ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
