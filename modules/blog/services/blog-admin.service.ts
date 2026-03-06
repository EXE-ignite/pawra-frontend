import { apiService } from '@/modules/shared/services';
import { BlogPost, BlogCategory } from '../types';
import { USE_MOCK_ADMIN, mapStatus, mapStatusToNumber } from './helpers';
import type { BlogStats } from '../pages/AdminBlogPage/AdminBlogPage.types';
import type { BlogTablePost } from '../components/BlogTable/BlogTable.types';
import type { BlogEditorFormData } from '../components/BlogEditor/BlogEditor.types';

/**
 * Blog Admin Service
 * Handles all admin-specific blog operations
 */
class BlogAdminService {
  private readonly adminEndpoint = '/admin/blog';
  private readonly postEndpoint = '/BlogPosts';

  async getAdminStats(config?: any): Promise<BlogStats> {
    if (USE_MOCK_ADMIN) {
      return {
        totalViews: 128430,
        viewsChange: '+12%',
        totalPosts: 156,
        totalComments: 2842,
        commentsTimeRange: 'Last 30 days',
      };
    }

    try {
      const url = `${this.adminEndpoint}/stats`;
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
    if (USE_MOCK_ADMIN) {
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

      const url = `${this.adminEndpoint}/posts?${params.toString()}`;
      if (config && config.headers && config.headers.Authorization) {
        console.log('[DEBUG] Bearer token:', config.headers.Authorization);
      }
      console.log('[DEBUG] Fetching admin posts:', url, config);
      const response = await apiService.get<any>(url, config);
      console.log('[DEBUG] Raw API response:', response);
      console.log('[DEBUG] Response.data:', response.data);
      console.log('[DEBUG] Response.data keys:', Object.keys(response.data || {}));
      
      const items = response.data?.items || response.data?.posts || [];
      
      const mappedPosts = items.map((post: any) => ({
        ...post,
        status: mapStatus(post.status)
      }));
      
      const mappedResponse = {
        posts: mappedPosts,
        total: response.data?.totalItems || response.data?.total || 0,
        totalPages: response.data?.totalPages || 1,
      };
      
      console.log('[DEBUG] Mapped response:', mappedResponse);
      console.log('[DEBUG] Posts count:', mappedResponse.posts.length);
      
      return mappedResponse;
    } catch (error: any) {
      console.error('Error fetching admin posts:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
      });
      console.error('Full error:', error);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    if (USE_MOCK_ADMIN) {
      console.log('Mock: Delete post', postId);
      return;
    }

    try {
      await apiService.delete(`${this.postEndpoint}/${postId}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async createPost(data: BlogEditorFormData): Promise<BlogPost> {
    if (USE_MOCK_ADMIN) {
      console.log('Mock: Create post', data);
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
      console.log('[DEBUG] Creating post');
      console.log('[DEBUG] Title:', data.title);
      console.log('[DEBUG] Slug:', data.slug);
      console.log('[DEBUG] Excerpt length:', data.excerpt?.length || 0);
      console.log('[DEBUG] Content length:', data.content?.length || 0);
      console.log('[DEBUG] ThumbnailUrl:', data.thumbnailUrl?.substring(0, 100) || 'empty');
      console.log('[DEBUG] CategoryId:', data.categoryId);
      console.log('[DEBUG] Status:', data.status);
      console.log('[DEBUG] Endpoint:', `${this.postEndpoint}`);
      
      if (!data.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!data.content?.trim()) {
        throw new Error('Content is required');
      }
      
      const backendData: any = {
        title: data.title.trim(),
        slug: data.slug?.trim() || data.title.toLowerCase().replace(/\s+/g, '-'),
        content: data.content,
        excerpt: data.excerpt?.trim() || '',
        thumbnailUrl: data.thumbnailUrl?.trim() || null,
        categoryIds: data.categoryId ? [data.categoryId] : [],
        status: mapStatusToNumber(data.status),
        publishedDate: data.status === 'Published' ? new Date().toISOString() : null
      };
      
      console.log('[DEBUG] Backend data prepared (matching CreateBlogPostDto schema):', {
        titleLength: backendData.title.length,
        slugLength: backendData.slug.length,
        contentLength: backendData.content.length,
        excerptLength: backendData.excerpt.length,
        thumbnailUrl: backendData.thumbnailUrl,
        categoryIds: backendData.categoryIds,
        status: backendData.status,
        publishedDate: backendData.publishedDate
      });
      
      const response = await apiService.post<BlogPost>(`${this.postEndpoint}`, backendData);
      console.log('[DEBUG] Create post response:', response);
      return response.data;
    } catch (error: any) {
      const errMessage = error?.message || 'Unknown error';
      const errStatus = error?.status ?? error?.response?.status ?? 0;
      const errErrors = error?.errors || error?.response?.data?.errors;
      console.error('Error creating post:', errMessage, '| status:', errStatus, '| errors:', errErrors);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async updatePost(postId: string, data: BlogEditorFormData): Promise<BlogPost> {
    if (USE_MOCK_ADMIN) {
      console.log('Mock: Update post', postId, data);
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
      console.log('[DEBUG] Updating post with data:', postId);
      console.log('[DEBUG] Title:', data.title);
      console.log('[DEBUG] Slug:', data.slug);
      console.log('[DEBUG] Excerpt length:', data.excerpt?.length || 0);
      console.log('[DEBUG] Content length:', data.content?.length || 0);
      console.log('[DEBUG] ThumbnailUrl:', data.thumbnailUrl?.substring(0, 100) || 'empty');
      console.log('[DEBUG] CategoryId:', data.categoryId);
      console.log('[DEBUG] Status:', data.status);
      console.log('[DEBUG] Endpoint:', `${this.postEndpoint}/${postId}`);
      
      if (!data.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!data.content?.trim()) {
        throw new Error('Content is required');
      }
      
      const backendData: any = {
        id: postId,
        title: data.title.trim(),
        slug: data.slug?.trim() || data.title.toLowerCase().replace(/\s+/g, '-'),
        content: data.content,
        excerpt: data.excerpt?.trim() || '',
        thumbnailUrl: data.thumbnailUrl?.trim() || null,
        categoryIds: data.categoryId ? [data.categoryId] : [],
        status: mapStatusToNumber(data.status),
        publishedDate: data.status === 'Published' ? new Date().toISOString() : null
      };
      
      console.log('[DEBUG] Backend data prepared (matching UpdateBlogPostDto schema):', {
        id: backendData.id,
        titleLength: backendData.title.length,
        slugLength: backendData.slug.length,
        contentLength: backendData.content.length,
        excerptLength: backendData.excerpt.length,
        thumbnailUrl: backendData.thumbnailUrl,
        categoryIds: backendData.categoryIds,
        status: backendData.status,
        publishedDate: backendData.publishedDate
      });
      
      const response = await apiService.put<BlogPost>(`${this.postEndpoint}/${postId}`, backendData);
      console.log('[DEBUG] Update post response:', response);
      return response.data;
    } catch (error: any) {
      console.error('❌ [ERROR] Update post failed');
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error message:', error?.message);
      console.error('Error status:', error?.status);
      console.error('Error errors:', error?.errors);
      console.error('Error keys:', error ? Object.keys(error) : 'error is null/undefined');
      console.error('Error stringified:', JSON.stringify(error, null, 2));
      console.error('Full error:', error);
      
      if (error?.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      
      throw error;
    }
  }
}

export const blogAdminService = new BlogAdminService();
