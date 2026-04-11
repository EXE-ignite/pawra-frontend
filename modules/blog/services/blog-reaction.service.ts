import { apiService } from '@/modules/shared/services';
import { BlogReaction, BLOG_REACTION_TYPE_IDS, BlogReactionType, RawReactionStat } from '../types';
import { USE_MOCK } from './helpers';

const UUID_CACHE_KEY = 'pawra_rxn_uuids';

// Inverse map: UUID (lowercase) → ReactionType (updated as real UUIDs are discovered)
const UUID_TO_TYPE: Record<string, BlogReactionType> = Object.fromEntries(
  Object.entries(BLOG_REACTION_TYPE_IDS).map(([k, v]) => [v.toLowerCase(), k as BlogReactionType])
);

/**
 * Blog Reaction Service
 * Handles all blog reaction-related operations
 */
class BlogReactionService {
  private readonly reactionEndpoint = '/blog-reactions';

  // Dynamically populated from real BE stats — overrides hardcoded UUIDs when available
  private dynamicTypeToUUID: Partial<Record<BlogReactionType, string>> = {};
  private seedAttempted = false;

  constructor() {
    this.loadCachedUUIDs();
  }

  private loadCachedUUIDs() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(UUID_CACHE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw) as Partial<Record<BlogReactionType, string>>;
      this.dynamicTypeToUUID = { ...cached };
      // Keep the inverse map in sync
      Object.entries(cached).forEach(([type, uuid]) => {
        if (uuid) UUID_TO_TYPE[uuid.toLowerCase()] = type as BlogReactionType;
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('📦 [ReactionService] loaded UUIDs from localStorage:', this.dynamicTypeToUUID);
      }
    } catch {}
  }

  private saveCachedUUIDs() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(UUID_CACHE_KEY, JSON.stringify(this.dynamicTypeToUUID));
    } catch {}
  }

  private learnUUID(type: BlogReactionType, uuid: string) {
    if (!uuid) return;
    const changed = this.dynamicTypeToUUID[type] !== uuid;
    this.dynamicTypeToUUID[type] = uuid;
    UUID_TO_TYPE[uuid.toLowerCase()] = type;
    if (changed) this.saveCachedUUIDs();
  }

  /** Discovers real reaction-type UUIDs by fetching stats from recently published posts */
  private async seedFromPublishedPosts(): Promise<void> {
    if (this.seedAttempted) return;
    this.seedAttempted = true;
    try {
      const postsRes = await apiService.get<any>('/BlogPosts/published?pageSize=10');
      const raw = postsRes.data ?? postsRes;
      const posts: any[] = Array.isArray(raw) ? raw :
        Array.isArray(raw?.data) ? raw.data : [];

      for (const post of posts.slice(0, 5)) {
        if (!post?.id) continue;
        // Fetch only stats (not my-reactions) to learn UUIDs
        await this.fetchStats(post.id);
        if (Object.keys(this.dynamicTypeToUUID).length >= 4) break;
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ReactionService] UUID seed from published posts failed:', err);
      }
    }
  }

  /** Fetches and processes stats for one post to populate dynamicTypeToUUID */
  private async fetchStats(postId: string): Promise<void> {
    try {
      const statsRes = await apiService.get<RawReactionStat[]>(`/BlogPosts/${postId}/reactions`);
      const raw = statsRes.data ?? statsRes;
      const toStatArray = (r: any): RawReactionStat[] => {
        if (!r) return [];
        if (Array.isArray(r)) return r;
        if (Array.isArray(r?.data)) return r.data;
        if (Array.isArray(r?.$values)) return r.$values;
        if (r?.data && Array.isArray(r.data.$values)) return r.data.$values;
        // { typeName: count } object format
        if (r && typeof r === 'object' && !Array.isArray(r)) {
          return Object.entries(r as Record<string, number>).map(([typeName, count]) => ({
            reactionTypeId: '',
            reactionTypeName: typeName,
            count: typeof count === 'number' ? count : 0,
          }));
        }
        return [];
      };
      const stats: RawReactionStat[] = toStatArray(raw);

      const validTypes: BlogReactionType[] = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
      for (const stat of stats) {
        const typeByUUID = stat.reactionTypeId ? UUID_TO_TYPE[stat.reactionTypeId.toLowerCase()] : undefined;
        const typeName = stat.reactionTypeName?.toLowerCase() as BlogReactionType | undefined;
        const type = typeByUUID || (typeName && validTypes.includes(typeName) ? typeName : undefined);
        if (type && stat.reactionTypeId) this.learnUUID(type, stat.reactionTypeId);
      }
    } catch {}
  }

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
      // Parallel: GET reaction counts + GET current user's reaction (only if logged in)
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('authToken');

      // my-reactions lives at /api/blog-posts/my-reactions (no /v1 prefix per swagger).
      // Build absolute URL to bypass the /v1 in NEXT_PUBLIC_API_URL.
      const apiBaseNoVersion = apiService.getBaseURL().replace(/\/v\d+\/?$/, '');
      const myReactionsUrl = `${apiBaseNoVersion}/blog-posts/my-reactions`;

      const [statsRes, myRes] = await Promise.allSettled([
        apiService.get<RawReactionStat[]>(`/BlogPosts/${postId}/reactions`),
        hasToken
          ? apiService.post<{ [postId: string]: string | null }>(myReactionsUrl, { postIds: [postId] })
          : Promise.resolve({ data: {} as { [postId: string]: string | null }, success: true, status: 200 }),
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
        if (Array.isArray(val.data)) return val.data;             // ApiResponse { data: [] }
        if (Array.isArray(val.$values)) return val.$values;       // .NET $values
        if (val.data && Array.isArray(val.data.$values)) return val.data.$values;
        // BE returns data as {} (no reactions) or { typeName: count } object
        // e.g. { "like": 5, "love": 3 } — NOT an array; stats do not include UUIDs
        if (val.data !== null && val.data !== undefined && typeof val.data === 'object') {
          const entries = Object.entries(val.data as Record<string, number>);
          return entries.map(([typeName, count]) => ({
            reactionTypeId: '',  // UUIDs not returned by stats endpoint
            reactionTypeName: typeName,
            count: typeof count === 'number' ? count : 0,
          }));
        }
        return [];  // null data or unknown — treat as empty
      };
      const stats: RawReactionStat[] = extractStats(rawValue);

      // my-reactions returns the reaction TYPE NAME (e.g. "like"), NOT a UUID
      const myReactionName: string | null =
        myRes.status === 'fulfilled' ? (myRes.value.data?.[postId] ?? null) : null;

      const validTypes: BlogReactionType[] = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

      return stats
        .map(stat => {
          // Primary: map by UUID; Secondary fallback: map by reactionTypeName (e.g. "Like" → "like")
          const typeById = UUID_TO_TYPE[stat.reactionTypeId?.toLowerCase()];
          const typeByName = stat.reactionTypeName?.toLowerCase() as BlogReactionType | undefined;
          const type: BlogReactionType | undefined = typeById
            || (typeByName && validTypes.includes(typeByName) ? typeByName : undefined);

          if (!type) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ [ReactionService] Unknown reactionTypeId / name:', stat.reactionTypeId, stat.reactionTypeName);
            }
            return null;
          }

          // Learn the real UUID from BE stats — persisted to localStorage for future sessions
          if (stat.reactionTypeId) this.learnUUID(type, stat.reactionTypeId);

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
    if (USE_MOCK) return { postId, reaction, count: 1, reacted: true };

    // Step 1: try stats for the current post (covers posts that already have reactions)
    if (!this.dynamicTypeToUUID[reaction]) {
      await this.fetchStats(postId);
    }
    // Step 2: if still unknown, scan recently published posts to discover all UUIDs
    if (!this.dynamicTypeToUUID[reaction]) {
      await this.seedFromPublishedPosts();
    }

    const reactionTypeId = this.dynamicTypeToUUID[reaction];
    if (!reactionTypeId) {
      // The stats endpoint returns { typeName: count } — UUIDs are never included.
      // Without a GET /api/v1/reaction-types endpoint, the frontend cannot resolve
      // the reactionTypeId UUID required by PUT /api/v1/blog-reactions.
      // Ask the backend team to expose reaction type UUIDs (e.g. GET /api/v1/reaction-types).
      const err = new Error(
        `Cannot toggle reaction "${reaction}": reactionTypeId UUID is unknown. ` +
        `The backend stats endpoint does not return UUIDs. ` +
        `Backend needs to expose GET /api/v1/reaction-types.`
      );
      console.error('❌ [ReactionService]', err.message);
      throw err;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 [ReactionService] toggle "${reaction}" → ${reactionTypeId}`);
    }

    try {
      const res = await apiService.put<BlogReaction | null>(this.reactionEndpoint, {
        targetType: 'Post',
        targetId: postId,
        reactionTypeId,
      });
      return res.data ?? { postId, reaction, count: 0, reacted: true };
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to toggle reaction:', { postId, reaction }, error);
      throw error;
    }
  }

  // After toggling, re-fetch true stats + user reaction from server
  async refreshPostReactions(postId: string): Promise<BlogReaction[]> {
    return this.getPostReactions(postId);
  }

  async getMyReactionsBatch(postIds: string[]): Promise<{ [postId: string]: string | null }> {
    if (USE_MOCK) {
      return {};
    }
    try {
      const apiBaseNoVersion = apiService.getBaseURL().replace(/\/v\d+\/?$/, '');
      const myReactionsUrl = `${apiBaseNoVersion}/blog-posts/my-reactions`;
      const res = await apiService.post<{ [postId: string]: string | null }>(myReactionsUrl, { postIds });
      return res.data;
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to fetch batch reactions:', { postIdsCount: postIds.length }, error);
      return {};
    }
  }
}

export const blogReactionService = new BlogReactionService();
