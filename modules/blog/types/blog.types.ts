// ===== Blog Comment =====
// Raw shape returned by the BE (flat authorId / authorName)
export interface RawBlogComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  parentId?: string | null;
  replies?: RawBlogComment[]; // BE returns comment tree
}

// Normalised shape used throughout the FE
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
export type BlogReactionType = 'like' | 'love' | 'haha' | 'angry' | 'sad' | 'wow';

export const BLOG_REACTION_TYPE_IDS: Record<BlogReactionType, string> = {
  like:  '9D34726A-4D87-4154-A01C-C94D09B3A450',
  love:  '6F3BD810-6C62-4328-8730-26C496FA4EFB',
  haha:  'C89B5834-F16A-4AF4-86C6-2E9796296124',
  angry: 'FBC01CBB-2836-48CE-B6DD-E43C05399751',
  sad:   '37931634-3641-4160-9A8D-3729D273108C',
  wow:   '0C04BB1B-3862-4D51-BEDC-DFCC4AC516C2',
};

// Raw reaction stat returned by GET /api/BlogPosts/{postId}/reactions
export interface RawReactionStat {
  reactionTypeId: string;
  reactionTypeName: string;
  count: number;
}

export interface BlogReaction {
  postId: string;
  reaction: BlogReactionType;
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
  status?: 'Published' | 'Draft' | 'Scheduled';
  isFeatured?: boolean;
  reactionSummary?: Record<string, number>;
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
