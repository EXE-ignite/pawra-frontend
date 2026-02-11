import { BlogPage } from '@/modules/blog/pages/BlogPage';
import { blogService } from '@/modules/blog/services';
import { MainLayout } from '@/modules/shared/layouts/MainLayout';
import { getServerAuthToken } from '@/modules/shared/utils/server-auth';

export default async function Blog() {
  // Lấy token từ cookie phía server
  const token = getServerAuthToken();
  const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

  // Lấy featured post và latest posts từ API thật với Bearer token
  const [featured] = await blogService.getFeaturedPosts(authConfig);
  const latestPosts = await blogService.getBlogPosts(authConfig);

  return (
    <MainLayout>
      <BlogPage featuredPost={featured} latestPosts={latestPosts} />
    </MainLayout>
  );
}
