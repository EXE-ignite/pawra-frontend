import { blogService } from '@/modules/blog/services';
import { AdminBlogPage } from '@/modules/blog/pages/AdminBlogPage';

export default async function AdminBlogManagementPage() {
  // Fetch data on server side
  const [stats, postsData] = await Promise.all([
    blogService.getAdminStats(),
    blogService.getAdminPosts(1, 10) // page 1, 10 items per page
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
