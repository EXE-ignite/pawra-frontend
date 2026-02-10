export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  imageUrl: string;
  readTime: number;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  isFeatured?: boolean;
}

export type BlogCategory = 
  | 'health' 
  | 'nutrition' 
  | 'training' 
  | 'behavior' 
  | 'grooming';

export interface CategoryInfo {
  id: BlogCategory;
  label: string;
  icon: string;
  color: string;
}
