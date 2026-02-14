import { apiService } from '@/modules/shared/services';
import { BlogComment } from '../types';
import { USE_MOCK } from './helpers';

/**
 * Blog Comment Service
 * Handles all blog comment-related operations
 */
class BlogCommentService {
  private readonly postEndpoint = '/BlogPosts';
  private readonly commentEndpoint = '/blog-comments';

  async getBlogPostComments(postId: string): Promise<BlogComment[]> {
    if (USE_MOCK) {
      return [];
    }
    try {
      // Correct endpoint according to BE API doc: /api/BlogPosts/{postId}/comments
      const res = await apiService.get<BlogComment[]>(`${this.postEndpoint}/${postId}/comments`);
      return res.data;
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to fetch comments for post:', postId);
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error status:', error?.status);
      console.error('Error response:', error?.response?.data);
      console.error('Full error:', JSON.stringify(error, null, 2));
      return []; // Return empty array on error
    }
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
    
    console.log('[INFO] 💬 Adding comment to post:', postId);
    console.log('[INFO] 📝 Comment data:', data);
    
    // Try multiple endpoint patterns
    const endpoints = [
      `${this.postEndpoint}/${postId}/comments`,  // Pattern 1: /BlogPosts/{postId}/comments (matches GET)
      `${this.commentEndpoint}`,                   // Pattern 2: /blog-comments (with postId in body)
      `${this.commentEndpoint}/post/${postId}`,    // Pattern 3: /blog-comments/post/{postId}
    ];
    
    const errors: Array<{ endpoint: string; status: number; message: string; data: any }> = [];
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      try {
        console.log(`[INFO] 🔄 Trying endpoint ${i + 1}/${endpoints.length}:`, endpoint);
        
        // For pattern 2, include postId in body
        const requestData = i === 1 ? { ...data, postId } : data;
        console.log(`[INFO]    Request data:`, requestData);
        
        const res = await apiService.post<BlogComment>(endpoint, requestData);
        console.log('✅ [SUCCESS] Comment added successfully via:', endpoint);
        console.log('✅ Response:', res);
        return res.data;
      } catch (error: any) {
        // Error has been transformed by error handler
        const status = error?.status || error?.response?.status || 0;
        const errorData = error?.errors || error?.response?.data;
        
        console.log(`❌ Endpoint ${i + 1} failed with status: ${status}`);
        console.log(`   Error message:`, error?.message);
        console.log(`   Error response:`, errorData);
        
        errors.push({
          endpoint,
          status: status,
          message: error?.message || 'Unknown error',
          data: errorData
        });
        
        // If not the last endpoint and got 404 or 405, try next one
        if (i < endpoints.length - 1 && (status === 404 || status === 405)) {
          console.log(`   ℹ️  ${status} error (${status === 404 ? 'Not Found' : 'Method Not Allowed'}), trying next endpoint...`);
          continue;
        }
        
        // If last endpoint or non-404 error, log all attempts and throw
        console.error('❌ [ERROR] Comment submission failed. Summary of all attempts:');
        errors.forEach((err, idx) => {
          console.error(`   ${idx + 1}. ${err.endpoint}`);
          console.error(`      Status: ${err.status}`);
          console.error(`      Message: ${err.message}`);
          console.error(`      Data:`, err.data);
        });
        
        // Provide user-friendly error messages
        if (status === 404) {
          throw new Error('💬 Comment feature not yet implemented by backend. Please contact support.');
        } else if (status === 401) {
          throw new Error('🔒 You must be logged in to comment. Please sign in and try again.');
        } else if (status === 403) {
          throw new Error('🚫 You do not have permission to comment on this post.');
        } else if (status === 400) {
          const backendMsg = errorData?.message || errorData?.error;
          throw new Error(`❌ Invalid comment: ${backendMsg || 'Please check your comment and try again.'}`);
        } else if (status >= 500) {
          throw new Error('⚠️ Server error. Please try again later.');
        }
        
        // Generic error
        throw new Error(`❌ Failed to post comment: ${error?.message || 'Unknown error'}`);
      }
    }
    
    throw new Error('Failed to post comment - all endpoints returned 404');
  }

  async deleteComment(commentId: string): Promise<void> {
    if (USE_MOCK) {
      return;
    }
    try {
      // Correct endpoint: DELETE /api/blog-comments/{commentId}
      await apiService.delete(`${this.commentEndpoint}/${commentId}`);
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to delete comment:', {
        commentId,
        error: error?.message,
        status: error?.status
      });
      throw error;
    }
  }
}

export const blogCommentService = new BlogCommentService();
