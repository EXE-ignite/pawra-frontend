import { blogService } from '@/modules/blog/services';
import { AdminBlogPage } from '@/modules/blog/pages/AdminBlogPage';
import { getServerAuthToken } from '@/modules/shared/utils/server-auth';

export default async function AdminBlogManagementPage() {
  // Lấy token từ cookie phía server
  const token = getServerAuthToken();
  const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

  // Fetch data on server side với Bearer token
  const [stats, postsData] = await Promise.all([
    blogService.getAdminStats(authConfig),
    blogService.getAdminPosts(1, 10, undefined, undefined, authConfig)
  ]);

  return (
    <AdminBlogPage
      initialStats={stats}
      initialPosts={postsData.posts}
      totalPosts={postsData.total}
      totalPages={postsData.totalPages}
    />
  );
}
