import { apiService } from '@/modules/shared/services';
import { BlogPost } from '../types';
import { mockBlogData } from './mock-data';

/**
 * Blog Service - API Ready
 * 
 * To switch from mock data to real API:
 * 1. Set USE_MOCK = false
 * 2. Ensure .env.local has NEXT_PUBLIC_API_URL configured
 * 3. Backend must implement endpoints documented in README.md
 */
const USE_MOCK = true; // TODO: Set to false when API is ready

class BlogService {
  private readonly endpoint = '/blog';

  async getFeaturedPost(): Promise<BlogPost> {
    if (USE_MOCK) {
      return mockBlogData.featuredPost;
    }

    try {
      const response = await apiService.get<BlogPost>(`${this.endpoint}/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured post:', error);
      throw error;
    }
  }

  async getLatestPosts(page = 1, limit = 10): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts;
    }

    try {
      const response = await apiService.get<BlogPost[]>(
        `${this.endpoint}/posts?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      throw error;
    }
  }

  async getPostById(id: string): Promise<BlogPost> {
    if (USE_MOCK) {
      const post = mockBlogData.latestPosts.find(p => p.id === id);
      if (!post) throw new Error('Post not found');
      return post;
    }

    try {
      const response = await apiService.get<BlogPost>(`${this.endpoint}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  async getPostsByCategory(category: string, page = 1, limit = 10): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.filter(p => p.category === category);
    }

    try {
      const response = await apiService.get<BlogPost[]>(
        `${this.endpoint}/posts?category=${category}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      throw error;
    }
  }

  async searchPosts(query: string, page = 1, limit = 10): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await apiService.get<BlogPost[]>(
        `${this.endpoint}/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();
