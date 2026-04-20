import type { LoadStatus, EntityStatus, InvoiceStatus } from '@/types';

type BadgeValue = LoadStatus | EntityStatus | InvoiceStatus;

interface BadgeProps {
  value: BadgeValue;
}

const classMap: Record<string, string> = {
  'Delivered':  'badge--delivered',
  'In Transit': 'badge--in-transit',
  'Pending':    'badge--pending',
  'Cancelled':  'badge--cancelled',
  'Active':     'badge--active',
  'Inactive':   'badge--inactive',
  'Paid':       'badge--paid',
  'Sent':       'badge--sent',
  'Draft':      'badge--draft',
};

export default function Badge({ value }: BadgeProps) {
  const modifier = classMap[value] ?? 'badge--inactive';
  return <span className={`badge ${modifier}`}>{value}</span>;
}
