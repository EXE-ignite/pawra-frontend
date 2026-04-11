import { apiService } from '@/modules/shared/services';
import { BlogComment, RawBlogComment } from '../types';
import { USE_MOCK } from './helpers';

// Helper: normalise a raw BE comment to the FE BlogComment shape
function normaliseComment(raw: RawBlogComment): BlogComment {
  return {
    id: raw.id,
    postId: raw.postId,
    content: raw.content,
    createdAt: raw.createdAt,
    parentId: raw.parentId ?? undefined,
    author: {
      id: raw.authorId,
      name: raw.authorName,
    },
    // Recursively normalise nested replies if BE returned tree
    replies: raw.replies?.map(normaliseComment) ?? [],
  };
}

/**
 * Blog Comment Service
 * Handles all blog comment-related operations
 */
class BlogCommentService {
  private readonly postEndpoint = '/BlogPosts';
  private readonly commentEndpoint = '/blog-comments';

  async getBlogPostComments(postId: string): Promise<BlogComment[]> {
    if (USE_MOCK) return [];
    try {
      // BE returns comment tree: GET /api/BlogPosts/{postId}/comments
      const res = await apiService.get<RawBlogComment[]>(`${this.postEndpoint}/${postId}/comments`);
      const raw = res.data ?? [];

      // If BE already returns a tree (replies nested), normalise directly
      const hasNestedReplies = raw.some(r => (r.replies?.length ?? 0) > 0);
      if (hasNestedReplies) {
        return raw.filter(r => !r.parentId).map(normaliseComment);
      }

      // Fallback: flat list — group manually
      const map = new Map<string, BlogComment>();
      for (const r of raw) map.set(r.id, { ...normaliseComment(r), replies: [] });
      const roots: BlogComment[] = [];
      for (const c of map.values()) {
        if (c.parentId && map.has(c.parentId)) map.get(c.parentId)!.replies!.push(c);
        else roots.push(c);
      }
      return roots;
    } catch (error: any) {
      console.error('❌ Failed to fetch comments:', postId, error?.message);
      return [];
    }
  }

  async addBlogComment(postId: string, data: { content: string; parentId?: string }): Promise<BlogComment> {
    if (USE_MOCK) {
      return {
        id: 'mock', postId, content: data.content,
        createdAt: new Date().toISOString(),
        author: { id: '1', name: 'Mock User' },
      };
    }

    // Body: only content + optional parentCommentId (postId is a PATH param, NOT in body)
    // BE uses `parentCommentId` per CreateBlogCommentDto swagger schema
    const body: Record<string, string> = { content: data.content };
    if (data.parentId) body.parentCommentId = data.parentId;

    try {
      // Confirmed endpoint from swagger: POST /api/BlogPosts/{postId}/comments
      const res = await apiService.post<RawBlogComment | null>(
        `${this.postEndpoint}/${postId}/comments`,
        body,
      );
      const raw = res.data;
      if (raw) return normaliseComment(raw);
      // 2xx but null body — build from known data
      return {
        id: `temp-${Date.now()}`,
        postId,
        content: data.content,
        createdAt: new Date().toISOString(),
        parentId: data.parentId,
        author: { id: '', name: 'You' },
        replies: [],
      };
    } catch (error: any) {
      const status = error?.status || error?.response?.status || 0;
      if (status === 401) throw new Error('🔒 Bạn cần đăng nhập để bình luận.');
      if (status === 403) throw new Error('🚫 Bạn không có quyền bình luận.');
      if (status === 400) {
        const msg = error?.errors?.message || error?.response?.data?.message;
        throw new Error(`❌ ${msg || 'Nội dung bình luận không hợp lệ.'}`);
      }
      throw new Error(`⚠️ ${error?.message || 'Không thể gửi bình luận. Vui lòng thử lại.'}`);
    }
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
