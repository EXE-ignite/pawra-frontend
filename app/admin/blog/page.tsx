import { blogService } from '@/modules/blog/services';
import { AdminBlogPage } from '@/modules/blog/pages/AdminBlogPage';
import { getServerAuthToken, getServerAuthRole } from '@/modules/shared/utils/server-auth';

const ALLOWED_ROLES = ['Admin', 'Staff', 'Vet', 'Receptionist'];

export default async function AdminBlogManagementPage() {
  // Lấy token và role từ cookie phía server
  const token = await getServerAuthToken();
  const role = await getServerAuthRole();
  
  if (!token) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Yêu cầu đăng nhập</h2>
        <p>Vui lòng đăng nhập để truy cập trang quản trị.</p>
      </div>
    );
  }

  if (!role || !ALLOWED_ROLES.includes(role)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Không có quyền truy cập</h2>
        <p>Tài khoản của bạn không có quyền truy cập trang này.</p>
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
