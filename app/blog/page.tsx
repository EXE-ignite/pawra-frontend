import { BlogPage } from '@/modules/blog/pages/BlogPage';
import { blogService } from '@/modules/blog/services';
import { getServerAuthToken } from '@/modules/shared/utils/server-auth';

export default async function Blog() {
  // Lấy published posts từ public API (không cần auth)
  try {
    const response = await blogService.getPublishedBlogPosts({ page: 1, pageSize: 10 });
    
    console.log('[BLOG PAGE] Response:', JSON.stringify(response, null, 2));
    console.log('[BLOG PAGE] Response type:', typeof response);
    console.log('[BLOG PAGE] Response keys:', Object.keys(response || {}));
    
    const latestPosts = response?.posts || [];
    
    console.log('[BLOG PAGE] Latest posts:', latestPosts);
    console.log('[BLOG PAGE] Posts count:', latestPosts.length);
    
    // Featured post là post đầu tiên trong danh sách published
    const featured = latestPosts[0] || null;

    return <BlogPage featuredPost={featured} latestPosts={latestPosts} />;
  } catch (error) {
    console.warn('[BLOG PAGE] Error loading blog:', error);
    // Fallback to empty state
    return <BlogPage featuredPost={null} latestPosts={[]} />;
  }
}
