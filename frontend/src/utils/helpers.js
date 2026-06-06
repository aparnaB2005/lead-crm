export const STATUS_CONFIG = {
  New: { label: 'New', color: 'var(--blue)', bg: 'var(--blue-soft)', dot: '#3b82f6' },
  Contacted: { label: 'Contacted', color: 'var(--amber)', bg: 'var(--amber-soft)', dot: '#f59e0b' },
  Qualified: { label: 'Qualified', color: 'var(--purple)', bg: 'var(--purple-soft)', dot: '#a855f7' },
  Converted: { label: 'Converted', color: 'var(--green)', bg: 'var(--green-soft)', dot: '#22c55e' },
  Lost: { label: 'Lost', color: 'var(--red)', bg: 'var(--red-soft)', dot: '#ef4444' },
};

export const STATUSES = Object.keys(STATUS_CONFIG);

export const SOURCE_OPTIONS = ['Website', 'Referral', 'Social Media', 'Cold Call', 'Email', 'Other'];

export const getStatusClass = (status) => {
  const map = {
    New: 'badge-new',
    Contacted: 'badge-contacted',
    Qualified: 'badge-qualified',
    Converted: 'badge-converted',
    Lost: 'badge-lost',
  };
  return map[status] || 'badge-new';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatCurrency = (val) => {
  if (!val && val !== 0) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const avatarColors = [
  '#6c63ff', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7',
  '#ef4444', '#06b6d4', '#ec4899', '#14b8a6', '#f97316',
];

export const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
};

export const truncate = (str, len = 40) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
};
