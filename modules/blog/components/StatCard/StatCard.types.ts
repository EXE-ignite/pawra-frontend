export interface StatCardProps {
  icon: 'views' | 'posts' | 'comments';
  label: string;
  value: number | string;
  badge?: {
    text: string;
    variant: 'success' | 'info' | 'warning';
  };
}
