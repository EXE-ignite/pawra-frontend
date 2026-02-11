// ===== Blog Comment =====
export interface BlogComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  parentId?: string;
  replies?: BlogComment[];
}

// ===== Blog Reaction =====
export interface BlogReaction {
  postId: string;
  reaction: string; // e.g. 'like', 'love', 'haha', etc.
  count: number;
  reacted: boolean;
}
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
