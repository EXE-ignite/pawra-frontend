import { blogService } from '@/modules/blog/services';
import { AdminBlogPage } from '@/modules/blog/pages/AdminBlogPage';
import { getServerAuthToken } from '@/modules/shared/utils/server-auth';

export default async function AdminBlogManagementPage() {
  // Lấy token từ cookie phía server
  const token = await getServerAuthToken();
  
  console.log('[ADMIN PAGE] Token from cookie:', token ? 'EXISTS' : 'NOT FOUND');
  
  if (!token) {
    console.error('[ADMIN PAGE] No auth token found, user needs to login');
    // Redirect to login or show error
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <p>Please login to access the admin panel.</p>
      </div>
    );
  }
  
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  try {
    // Fetch data on server side với Bearer token
    const [stats, postsData] = await Promise.all([
      blogService.getAdminStats(authConfig),
      blogService.getAdminPosts(1, 10, undefined, undefined, authConfig)
    ]);

    console.log('[ADMIN PAGE] Stats:', stats);
    console.log('[ADMIN PAGE] PostsData:', postsData);

    return (
      <AdminBlogPage
        initialStats={stats}
        initialPosts={postsData?.posts || []}
        totalPosts={postsData?.total || 0}
        totalPages={postsData?.totalPages || 1}
      />
    );
  } catch (error) {
    console.error('[ADMIN PAGE] Error loading data:', error);
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error Loading Data</h2>
        <p>Failed to load admin data. Please try logging in again.</p>
      </div>
    );
  }
}
