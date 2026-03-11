import { apiService } from '@/modules/shared/services';
import { BlogPost } from '../types';
import { USE_MOCK, transformPostData, mapStatus, mapStatusToNumber } from './helpers';
import { mockBlogData } from './mock-data';

/**
 * Blog Post Service
 * Handles all blog post CRUD and query operations
 */
class BlogPostService {
  private readonly postEndpoint = '/BlogPosts';
  private readonly endpoint = '/BlogPosts';

  // ===== FEATURED & RELATED POSTS =====
  
  async getFeaturedPosts(config?: any): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.slice(0, 3);
    }
    const res = await apiService.get<BlogPost[]>(`${this.postEndpoint}/featured`, config);
    return res.data;
  }

  async getRelatedPosts(slug: string, limit: number = 3): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.slice(0, 3);
    }
    // Note: Backend uses SLUG (not postId) for related posts
    const res = await apiService.get<BlogPost[]>(`${this.postEndpoint}/${slug}/related?limit=${limit}`);
    return res.data;
  }

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

  // ===== GET OPERATIONS =====
  
  async getBlogPosts(config?: any): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts;
    }
    const res = await apiService.get<BlogPost[]>(`${this.postEndpoint}`, config);
    return res.data;
  }

  async getBlogPostById(id: string): Promise<BlogPost> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts[0];
    }
    try {
      const res = await apiService.get<any>(`${this.postEndpoint}/${id}`);
      const postData = res.data;
      return transformPostData(postData);
    } catch (error: any) {
      console.error('Error fetching blog post by ID:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
      });
      throw error;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts[0];
    }
    try {
      const res = await apiService.get<any>(`${this.postEndpoint}/slug/${slug}`);
      const postData = res.data;
      return transformPostData(postData);
    } catch (error: any) {
      console.error('Error fetching blog post by slug:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
      });
      throw error;
    }
  }

  async getBlogPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts;
    }
    try {
      const res = await apiService.get<any>(`${this.postEndpoint}/author/${authorId}`);
      const posts = Array.isArray(res.data) ? res.data : res.data?.items || [];
      return posts.map((postData: any) => transformPostData(postData));
    } catch (error: any) {
      console.error('Error fetching blog posts by author:', {
        message: error?.message,
        status: error?.status,
      });
      throw error;
    }
  }

  async getBlogPostsByStatus(status: 'Published' | 'Draft'): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.filter(p => p.status === status);
    }
    try {
      const numericStatus = mapStatusToNumber(status);
      const res = await apiService.get<any>(`${this.postEndpoint}/status/${numericStatus}`);
      const posts = Array.isArray(res.data) ? res.data : res.data?.items || [];
      return posts.map((postData: any) => transformPostData(postData));
    } catch (error: any) {
      console.error('Error fetching blog posts by status:', {
        message: error?.message,
        status: error?.status,
      });
      throw error;
    }
  }

  async getPublishedBlogPosts(params: { page?: number; pageSize?: number; categorySlug?: string }, authToken?: string): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    if (USE_MOCK) {
      return { posts: mockBlogData.latestPosts, total: 10, totalPages: 1 };
    }
    const { page = 1, pageSize = 10, categorySlug } = params;
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(categorySlug ? { categorySlug } : {}),
    });
    
    console.log('[BLOG SERVICE] Fetching published posts:', `${this.postEndpoint}/published?${query}`);
    const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined;
    const res = await apiService.get<any>(`${this.postEndpoint}/published?${query}`, config);
    console.log('[BLOG SERVICE] Raw API Response:', res);
    
    const transformedPosts = (res.data?.items || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content || '',
      imageUrl: item.thumbnailUrl || '',
      readTime: item.readTime || 5,
      publishedAt: item.publishedDate || item.publishedAt,
      category: (() => { const cat = item.categories?.[0]; return (typeof cat === 'string' ? cat : cat?.name || cat?.slug || 'health'); })() as any,
      author: {
        name: item.author?.name || 'Unknown',
        avatar: item.author?.avatarUrl || '',
      },
    }));
    
    const mappedResponse = {
      posts: transformedPosts,
      total: res.data?.totalItems || 0,
      totalPages: res.data?.totalPages || 1,
    };
    
    console.log('[BLOG SERVICE] Transformed response:', mappedResponse);
    console.log('[BLOG SERVICE] Posts count:', transformedPosts.length);
    
    return mappedResponse;
  }

  async getLatestPosts(page = 1, limit = 10, authToken?: string): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts;
    }

    try {
      const result = await this.getPublishedBlogPosts({ page, pageSize: limit }, authToken);
      return result.posts;
    } catch (error: any) {
      console.error('Error fetching latest posts:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
      });
      console.error('Full error:', error);
      throw error;
    }
  }

  async getPostById(id: string, authToken?: string): Promise<BlogPost> {
    if (USE_MOCK) {
      const allPosts = [mockBlogData.featuredPost, ...mockBlogData.latestPosts];
      const post = allPosts.find(p => p.id === id);
      if (!post) throw new Error('Post not found');
      
      // Add full content for detail page
      return {
        ...post,
        content: `
          <p>Switching your cat's food can be a delicate process. Cats are notoriously sensitive to changes in their environment, and their digestive systems are no exception.</p>
          
          <p>Changing a cat's food too quickly can lead to gastrointestinal upset, including vomiting or diarrhea. Furthermore, some cats may simply refuse to eat the new food, which can be dangerous for their health. A slow and steady approach is the key to a successful transition.</p>
          
          <h2>The 7-Day Transition Schedule</h2>
          
          <p>Veterinarians generally recommend a 7-day transition period. This allows the beneficial bacteria in your cat's gut to adjust to the new ingredients. Here's a recommended breakdown:</p>
          
          <ul>
            <li><strong>Days 1-2:</strong> 75% old food, 25% new food.</li>
            <li><strong>Days 3-4:</strong> 50% old food, 50% new food.</li>
            <li><strong>Days 5-6:</strong> 25% old food, 75% new food.</li>
            <li><strong>Day 7:</strong> 100% new food.</li>
          </ul>
          
          <div class="pro-tip">
            <h4>💡 Pro-Tip</h4>
            <p>If your cat is particularly picky, you can extend this schedule to 14 days, increasing the new food in 10% increments every day or two.</p>
          </div>
          
          <h2>Monitoring Your Cat</h2>
          
          <p>During the transition, keep a close eye on your cat's behavior and litter box habits. Look for any signs of discomfort or refusal to eat. If your cat stops eating for more than 24 hours, contact your vet immediately, as this can lead to Hepatic Lipidosis.</p>
        `
      };
    }

    try {
      console.log('[BLOG SERVICE] Fetching post by ID:', id);
      const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined;
      const response = await apiService.get<any>(`${this.postEndpoint}/${id}`, config);
      console.log('[BLOG SERVICE] Post response:', response);
      
      const postData = response.data;
      const transformedPost = transformPostData(postData);
      
      console.log('[BLOG SERVICE] Transformed post:', transformedPost);
      return transformedPost;
    } catch (error: any) {
      console.error('Error fetching post:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
      });
      console.error('Full error:', error);
      throw error;
    }
  }

  async getPostsByCategory(category: string, page = 1, limit = 10): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.filter(p => p.category === category);
    }

    try {
      const response = await apiService.get<BlogPost[]>(
        `${this.endpoint}?category=${category}&page=${page}&limit=${limit}`
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
        `${this.endpoint}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  // ===== CUD OPERATIONS =====
  
  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    if (USE_MOCK) {
      return { ...mockBlogData.latestPosts[0], ...data } as BlogPost;
    }
    const res = await apiService.post<BlogPost>(`${this.postEndpoint}`, data);
    return res.data;
  }

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    if (USE_MOCK) {
      return { ...mockBlogData.latestPosts[0], ...data, id } as BlogPost;
    }
    const res = await apiService.put<BlogPost>(`${this.postEndpoint}/${id}`, data);
    return res.data;
  }

  async deleteBlogPost(id: string): Promise<void> {
    if (USE_MOCK) {
      return;
    }
    await apiService.delete(`${this.postEndpoint}/${id}`);
  }

  async publishBlogPost(id: string): Promise<BlogPost> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts[0];
    }
    const res = await apiService.patch<BlogPost>(`${this.postEndpoint}/${id}/publish`);
    return res.data;
  }

  async unpublishBlogPost(id: string): Promise<BlogPost> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts[0];
    }
    const res = await apiService.patch<BlogPost>(`${this.postEndpoint}/${id}/unpublish`);
    return res.data;
  }
}

export const blogPostService = new BlogPostService();
