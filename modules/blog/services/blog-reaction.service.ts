import { apiService } from '@/modules/shared/services';
import { BlogReaction } from '../types';
import { USE_MOCK } from './helpers';

/**
 * Blog Reaction Service
 * Handles all blog reaction-related operations
 */
class BlogReactionService {
  private readonly reactionEndpoint = '/blog-reactions';

  async getPostReactions(postId: string): Promise<BlogReaction[]> {
    if (USE_MOCK) {
      return [
        { postId, reaction: 'like', count: 24, reacted: false },
        { postId, reaction: 'love', count: 18, reacted: false },
        { postId, reaction: 'celebrate', count: 12, reacted: false },
        { postId, reaction: 'insightful', count: 9, reacted: false },
        { postId, reaction: 'curious', count: 5, reacted: false },
      ];
    }
    try {
      // NOTE: BE doesn't have GET endpoint for single post reactions
      // Using batch endpoint instead: POST /api/blog-posts/my-reactions
      // For now, return empty array to avoid errors
      console.log('[INFO] Post reactions endpoint not available in BE, returning empty array');
      return [];
      
      // TODO: Implement using batch endpoint when needed:
      // const res = await apiService.post<any>('/blog-posts/my-reactions', { postIds: [postId] });
      // return res.data[postId] || [];
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to fetch reactions for post:', postId);
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error status:', error?.status);
      console.error('Error response:', error?.response?.data);
      console.error('Full error:', JSON.stringify(error, null, 2));
      return [];
    }
  }

  async toggleBlogReaction(postId: string, reaction: string): Promise<BlogReaction> {
    if (USE_MOCK) {
      return { postId, reaction, count: 1, reacted: true };
    }
    try {
      // NOTE: BE API requires different schema:
      // PUT /api/blog-reactions
      // Body: { targetType: "Post", targetId: "uuid", reactionTypeId: "uuid" }
      // For now, we don't have reactionTypeId mapping, so reactions are disabled
      console.log('[INFO] Toggle reaction not implemented - waiting for reaction type ID mapping');
      throw new Error('Reaction feature not fully implemented yet');
      
      // TODO: Implement with correct schema:
      // const res = await apiService.put<BlogReaction>('/blog-reactions', {
      //   targetType: 'Post',
      //   targetId: postId,
      //   reactionTypeId: getReactionTypeId(reaction) // Need mapping
      // });
      // return res.data;
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to toggle reaction:', {
        postId,
        reaction,
        error: error?.message
      });
      throw error;
    }
  }

  async getMyReactionsBatch(postIds: string[]): Promise<{ [postId: string]: string | null }> {
    if (USE_MOCK) {
      return {};
    }
    try {
      // Correct endpoint according to BE API doc: POST /api/blog-posts/my-reactions
      // Body: { postIds: ["uuid1", "uuid2"] }
      const res = await apiService.post<{ [postId: string]: string | null }>('/blog-posts/my-reactions', { 
        postIds 
      });
      return res.data;
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to fetch batch reactions:', {
        postIdsCount: postIds.length,
        error: error?.message
      });
      return {};
    }
  }
}

export const blogReactionService = new BlogReactionService();
