import { apiService } from '@/modules/shared/services';
import { BlogPost, BlogCategory, BlogComment, BlogReaction } from '../types';
import { mockBlogData } from './mock-data';
import type { BlogStats } from '../pages/AdminBlogPage/AdminBlogPage.types';
import type { BlogTablePost } from '../components/BlogTable/BlogTable.types';
import type { BlogEditorFormData } from '../components/BlogEditor/BlogEditor.types';

/**
 * Blog Service - API Ready
 * 
 * To switch from mock data to real API:
 * 1. Set USE_MOCK = false
 * 2. Ensure .env.local has NEXT_PUBLIC_API_URL configured
 * 3. Backend must implement endpoints documented in README.md
 */
const USE_MOCK = true; // Dùng mock data tạm vì backend chưa có admin endpoints
const USE_MOCK_ADMIN = true; // Backend chưa có admin endpoints → dùng mock tạm

class BlogService {
      // ===== FEATURED & RELATED POSTS =====
      async getFeaturedPosts(config?: any): Promise<BlogPost[]> {
        if (USE_MOCK) {
          return mockBlogData.latestPosts.slice(0, 3);
        }
        const res = await apiService.get<BlogPost[]>(`${this.postEndpoint}/featured`, config);
        return res.data;
      }

      async getRelatedPosts(postId: string): Promise<BlogPost[]> {
        if (USE_MOCK) {
          return mockBlogData.latestPosts.slice(0, 3);
        }
        const res = await apiService.get<BlogPost[]>(`${this.postEndpoint}/${postId}/related`);
        return res.data;
      }
    // ===== BLOG COMMENTS =====
    async getBlogPostComments(postId: string): Promise<BlogComment[]> {
      if (USE_MOCK) {
        return [];
      }
      const res = await apiService.get<BlogComment[]>(`${this.commentEndpoint}/post/${postId}`);
      return res.data;
    }

    async addBlogComment(postId: string, data: { content: string; parentId?: string }): Promise<BlogComment> {
      if (USE_MOCK) {
        return {
          id: 'mock',
          postId,
          content: data.content,
          createdAt: new Date().toISOString(),
          author: { id: '1', name: 'Mock User' },
        };
      }
      const res = await apiService.post<BlogComment>(`${this.commentEndpoint}/post/${postId}`, data);
      return res.data;
    }

    async deleteComment(commentId: string): Promise<void> {
      if (USE_MOCK) {
        return;
      }
      await apiService.delete(`${this.commentEndpoint}/${commentId}`);
    }

    // ===== BLOG REACTIONS =====
    async toggleBlogReaction(postId: string, reaction: string): Promise<BlogReaction> {
      if (USE_MOCK) {
        return { postId, reaction, count: 1, reacted: true };
      }
      const res = await apiService.post<BlogReaction>(`${this.reactionEndpoint}/toggle`, { postId, reaction });
      return res.data;
    }

    async getMyReactionsBatch(postIds: string[]): Promise<{ [postId: string]: string | null }> {
      if (USE_MOCK) {
        return {};
      }
      const res = await apiService.post<{ [postId: string]: string | null }>(`${this.reactionEndpoint}/batch`, { postIds });
      return res.data;
    }
  // Chuẩn hóa endpoint cho API mới (baseURL đã có /api rồi)
  private readonly endpoint = '/BlogPosts';  // Dùng cho admin routes
  private readonly postEndpoint = '/BlogPosts';
  private readonly categoryEndpoint = '/BlogCategories';
  private readonly commentEndpoint = '/blog-comments';
  private readonly reactionEndpoint = '/blog-reactions';

  // ===== BLOG CATEGORIES =====
  async getBlogCategories(): Promise<BlogCategory[]> {
    if (USE_MOCK) {
      return [
        'health', 'nutrition', 'training', 'behavior', 'grooming',
      ];
    }
    const res = await apiService.get<BlogCategory[]>(`${this.categoryEndpoint}`);
    return res.data;
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory> {
    if (USE_MOCK) {
      return 'health';
    }
    const res = await apiService.get<BlogCategory>(`${this.categoryEndpoint}/${slug}`);
    return res.data;
  }

  // ===== BLOG POSTS =====
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
    const res = await apiService.get<BlogPost>(`${this.postEndpoint}/${id}`);
    return res.data;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts[0];
    }
    const res = await apiService.get<BlogPost>(`${this.postEndpoint}/slug/${slug}`);
    return res.data;
  }

  async getPublishedBlogPosts(params: { page?: number; pageSize?: number; categorySlug?: string }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    if (USE_MOCK) {
      return { posts: mockBlogData.latestPosts, total: 10, totalPages: 1 };
    }
    const { page = 1, pageSize = 10, categorySlug } = params;
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(categorySlug ? { categorySlug } : {}),
    });
    const res = await apiService.get<{ posts: BlogPost[]; total: number; totalPages: number }>(`${this.postEndpoint}/published?${query}`);
    return res.data;
  }

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
        `${this.endpoint}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      throw error;
    }
  }

  async getPostById(id: string): Promise<BlogPost> {
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
      const response = await apiService.get<BlogPost>(`${this.endpoint}/${id}`);
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

  // ============ ADMIN METHODS ============

  async getAdminStats(config?: any): Promise<BlogStats> {
    if (USE_MOCK) {
      return {
        totalViews: 128430,
        viewsChange: '+12%',
        totalPosts: 156,
        totalComments: 2842,
        commentsTimeRange: 'Last 30 days',
      };
    }

    try {
      const url = `${this.endpoint}/admin/stats`;
      if (config && config.headers && config.headers.Authorization) {
        console.log('[DEBUG] Bearer token:', config.headers.Authorization);
      }
      console.log('[DEBUG] Fetching admin stats:', url, config);
      const response = await apiService.get<BlogStats>(url, config);
      console.log('[DEBUG] API response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin stats - Full error:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error));
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
      });
      throw error;
    }
  }

  async getAdminPosts(
    page = 1,
    limit = 10,
    search?: string,
    status?: 'Published' | 'Draft' | 'Scheduled',
    config?: any
  ): Promise<{ posts: BlogTablePost[]; total: number; totalPages: number }> {
    if (USE_MOCK) {
      const mockPosts: BlogTablePost[] = [
        {
          id: '1',
          title: '10 Essential Tips for Puppy Training',
          slug: 'pet-care-training-tips.html',
          thumbnailUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
          author: {
            id: 'u1',
            name: 'Jane Doe',
            avatarUrl: 'https://i.pravatar.cc/150?u=jane',
          },
          category: 'Training',
          status: 'Published',
          date: 'Oct 24, 2023',
        },
        {
          id: '2',
          title: 'Understanding Cat Body Language',
          slug: 'cat-body-language-guide.html',
          thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
          author: {
            id: 'u2',
            name: 'Mark Smith',
            avatarUrl: 'https://i.pravatar.cc/150?u=mark',
          },
          category: 'Pet Care',
          status: 'Draft',
          date: 'Oct 26, 2023',
        },
        {
          id: '3',
          title: 'Nutritional Needs of Indoor Rabbits',
          slug: 'rabbit-nutrition-guide.html',
          thumbnailUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
          author: {
            id: 'u3',
            name: 'Alice Wong',
            avatarUrl: 'https://i.pravatar.cc/150?u=alice',
          },
          category: 'Health',
          status: 'Scheduled',
          date: 'Oct 30, 2023',
        },
        {
          id: '4',
          title: 'Creating a Safe Habitat for Parrots',
          slug: 'parrot-habitat-tips.html',
          thumbnailUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400',
          author: {
            id: 'u1',
            name: 'Jane Doe',
            avatarUrl: 'https://i.pravatar.cc/150?u=jane',
          },
          category: 'Lifestyle',
          status: 'Published',
          date: 'Oct 20, 2023',
        },
      ];

      return {
        posts: mockPosts,
        total: 156,
        totalPages: 40,
      };
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
      });

      const url = `${this.endpoint}/admin/posts?${params.toString()}`;
      if (config && config.headers && config.headers.Authorization) {
        console.log('[DEBUG] Bearer token:', config.headers.Authorization);
      }
      console.log('[DEBUG] Fetching admin posts:', url, config);
      const response = await apiService.get<{ posts: BlogTablePost[]; total: number; totalPages: number }>(
        url,
        config
      );
      console.log('[DEBUG] API response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin posts:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
      });
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    if (USE_MOCK) {
      console.log('Mock: Delete post', postId);
      return;
    }

    try {
      await apiService.delete(`${this.endpoint}/${postId}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async createPost(data: BlogEditorFormData): Promise<BlogPost> {
    if (USE_MOCK) {
      console.log('Mock: Create post', data);
      // Return mock created post
      return {
        id: Date.now().toString(),
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        imageUrl: data.thumbnailUrl,
        author: {
          name: 'Current User',
          avatar: '',
        },
        category: data.categoryId as BlogCategory,
        publishedAt: new Date().toISOString(),
        readTime: 5,
      };
    }

    try {
      const response = await apiService.post<BlogPost>(`${this.endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async updatePost(postId: string, data: BlogEditorFormData): Promise<BlogPost> {
    if (USE_MOCK) {
      console.log('Mock: Update post', postId, data);
      // Return mock updated post
      return {
        id: postId,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        imageUrl: data.thumbnailUrl,
        author: {
          name: 'Current User',
          avatar: '',
        },
        category: data.categoryId as BlogCategory,
        publishedAt: new Date().toISOString(),
        readTime: 5,
      };
    }

    try {
      const response = await apiService.put<BlogPost>(`${this.endpoint}/${postId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();
