import { apiService } from '@/modules/shared/services';
import { BlogReaction, BLOG_REACTION_TYPE_IDS, BlogReactionType, RawReactionStat } from '../types';
import { USE_MOCK } from './helpers';

// Inverse map: UUID (lowercase) → ReactionType
const UUID_TO_TYPE: Record<string, BlogReactionType> = Object.fromEntries(
  Object.entries(BLOG_REACTION_TYPE_IDS).map(([k, v]) => [v.toLowerCase(), k as BlogReactionType])
);

/**
 * Blog Reaction Service
 * Handles all blog reaction-related operations
 */
class BlogReactionService {
  private readonly reactionEndpoint = '/blog-reactions';

  async getPostReactions(postId: string): Promise<BlogReaction[]> {
    if (USE_MOCK) {
      return [
        { postId, reaction: 'like',  count: 24, reacted: false },
        { postId, reaction: 'love',  count: 18, reacted: false },
        { postId, reaction: 'haha',  count: 12, reacted: false },
        { postId, reaction: 'wow',   count: 9,  reacted: false },
        { postId, reaction: 'sad',   count: 5,  reacted: false },
        { postId, reaction: 'angry', count: 3,  reacted: false },
      ];
    }
    try {
      // Parallel: GET reaction counts + GET current user's reaction
      const [statsRes, myRes] = await Promise.allSettled([
        apiService.get<RawReactionStat[]>(`/BlogPosts/${postId}/reactions`),
        apiService.post<{ [postId: string]: string | null }>('/blog-posts/my-reactions', { postIds: [postId] }),
      ]);

      // BE may return the array directly, or wrapped in ApiResponse { data: [] },
      // or .NET-serialised as { $values: [] }
      const rawValue = statsRes.status === 'fulfilled' ? statsRes.value : null;
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [ReactionService] raw statsRes.value:', rawValue);
      }
      const extractStats = (val: any): RawReactionStat[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val;                       // direct array
        if (Array.isArray(val.data)) return val.data;             // ApiResponse wrapper
        if (Array.isArray(val.$values)) return val.$values;       // .NET $values
        if (val.data && Array.isArray(val.data.$values)) return val.data.$values;
        console.warn('⚠️ Unexpected reaction stats shape:', val);
        return [];
      };
      const stats: RawReactionStat[] = extractStats(rawValue);

      // my-reactions returns the reaction TYPE NAME (e.g. "like"), NOT a UUID
      const myReactionName: string | null =
        myRes.status === 'fulfilled' ? (myRes.value.data?.[postId] ?? null) : null;

      return stats
        .map(stat => {
          const type = UUID_TO_TYPE[stat.reactionTypeId.toLowerCase()];
          if (!type) return null;
          return {
            postId,
            reaction: type,
            count: stat.count,
            // Compare reaction name against mapped type name (both lowercase)
            reacted: !!myReactionName && myReactionName.toLowerCase() === type.toLowerCase(),
          } satisfies BlogReaction;
        })
        .filter((r): r is BlogReaction => r !== null);
    } catch (error: any) {
      console.error('❌ Failed to fetch reactions:', postId, error?.message);
      return [];
    }
  }

  async toggleBlogReaction(postId: string, reaction: BlogReactionType): Promise<BlogReaction> {
    if (USE_MOCK) {
      return { postId, reaction, count: 1, reacted: true };
    }
    try {
      const res = await apiService.put<BlogReaction | null>(this.reactionEndpoint, {
        targetType: 'Post',
        targetId: postId,
        reactionTypeId: BLOG_REACTION_TYPE_IDS[reaction],
      });
      // BE may return null on success — return a minimal valid object as fallback
      return res.data ?? { postId, reaction, count: 0, reacted: true };
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to toggle reaction:', {
        postId,
        reaction,
        error: error?.message,
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
