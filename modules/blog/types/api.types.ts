import { BlogPost } from './blog.types';

// API Response types for blog endpoints
export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BlogSearchParams {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}
