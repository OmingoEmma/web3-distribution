export const PROJECT_TYPES = [
  'Music Production',
  'Design',
  'Film Production',
  'Writing',
  'Photography',
  'Software Development',
  'Art',
  'Other'
] as const;

export const RIGHTS_TYPES = [
  'Distribution Rights',
  'Royalties',
  'Licensing',
  'Merchandising',
  'Publishing',
  'Performance Rights',
  'Sync Rights',
  'Master Rights'
] as const;

export const REVENUE_SOURCES = [
  'Streaming Royalties',
  'Licensing Deal',
  'Project Completion',
  'Sales Revenue',
  'Performance Rights',
  'Sync Licensing',
  'Merchandise',
  'Other'
] as const;

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: 'home' },
  { name: 'Projects', href: '/dashboard/projects', icon: 'folder' },
  { name: 'Rights', href: '/dashboard/rights', icon: 'shield' },
  { name: 'Contracts', href: '/contracts', icon: 'document' },
  { name: 'Profile', href: '/profile', icon: 'user' },
];

export const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
};
