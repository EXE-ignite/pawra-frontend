'use client';

import { useState, useEffect } from 'react';
import { blogService } from '@/modules/blog/services';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/modules/shared/contexts';
import { StatCard } from '../../components/StatCard';
import { BlogTable, BlogTablePost } from '../../components/BlogTable';
import { BlogSearchBar } from '../../components/BlogSearchBar';
import { BlogStats } from './AdminBlogPage.types';
import styles from './AdminBlogPage.module.scss';

const DEFAULT_STATS: BlogStats = {
  totalViews: 0,
  viewsChange: '',
  totalPosts: 0,
  totalComments: 0,
  commentsTimeRange: '',
};

interface AdminBlogPageProps {
  initialStats?: BlogStats;
  initialPosts?: BlogTablePost[];
  totalPosts?: number;
  totalPages?: number;
}

export function AdminBlogPage({ 
  initialStats = DEFAULT_STATS,
  initialPosts = [],
  totalPosts: initialTotalPosts = 0,
  totalPages: initialTotalPages = 1,
}: AdminBlogPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogTablePost[]>(initialPosts);
  const [stats, setStats] = useState<BlogStats>(initialStats);
  const [totalPosts, setTotalPosts] = useState(initialTotalPosts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(initialPosts.length === 0);

  // Fetch data client-side on mount so the auth token is always available
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [fetchedStats, postsData] = await Promise.all([
          blogService.getAdminStats(),
          blogService.getAdminPosts(1, 10),
        ]);
        setStats(fetchedStats);
        setPosts(postsData.posts);
        setTotalPosts(postsData.total);
        setTotalPages(postsData.totalPages);
      } catch (err) {
        console.error('[AdminBlogPage] Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    // Only auto-fetch if not pre-populated from server
    if (initialPosts.length === 0) {
      loadInitialData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const res = await blogService.getAdminPosts(1, 10, query);
    setPosts(res.posts);
    setTotalPosts(res.total);
    setTotalPages(res.totalPages);
  };

  const handleFilter = () => {
    // TODO: Implement filter modal
    console.log('Open filter modal');
  };

  const handleCreate = () => {
    console.log('[DEBUG] Create button clicked, navigating to /admin/blog/create');
    router.push('/admin/blog/create');
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    const res = await blogService.getAdminPosts(page, 10, searchQuery);
    setPosts(res.posts);
    setTotalPosts(res.total);
    setTotalPages(res.totalPages);
  };

  const handleView = (postId: string) => {
    // TODO: Navigate to public post view
    router.push(`/blog/${postId}`);
  };

  const handleEdit = (postId: string) => {
    router.push(`/admin/blog/${postId}/edit`);
  };

  const handleDelete = async (postId: string) => {
    if (confirm(t('blog.confirmDelete'))) {
      await blogService.deletePost(postId);
      // Sau khi xóa, reload danh sách
      const res = await blogService.getAdminPosts(currentPage, 10, searchQuery);
      setPosts(res.posts);
    }
  };

  return (
    <div className={styles.adminBlogPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('blog.adminTitle')}</h1>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          icon="views"
          label={t('blog.totalViews')}
          value={stats.totalViews}
          badge={{ text: stats.viewsChange, variant: 'success' }}
        />
        <StatCard
          icon="posts"
          label={t('blog.totalPosts')}
          value={stats.totalPosts}
          badge={{ text: t('blog.active'), variant: 'info' }}
        />
        <StatCard
          icon="comments"
          label={t('blog.totalComments')}
          value={stats.totalComments}
          badge={{ text: stats.commentsTimeRange, variant: 'info' }}
        />
      </div>

      <div className={styles.tableSection}>
        <BlogSearchBar
          value={searchQuery}
          onSearch={handleSearch}
          onFilterClick={handleFilter}
          onCreateClick={handleCreate}
        />
        <BlogTable
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalPosts}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
