export interface BlogSharePostData {
  id: string;
  title: string;
  excerpt?: string;
}

export interface BlogShareProps {
  post: BlogSharePostData;
  variant?: 'icon' | 'panel';
}