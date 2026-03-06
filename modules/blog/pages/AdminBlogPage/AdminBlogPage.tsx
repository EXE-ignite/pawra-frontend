'use client';

import { useState } from 'react';
import { blogService } from '@/modules/blog/services';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/modules/shared/contexts';
import { StatCard } from '../../components/StatCard';
import { BlogTable, BlogTablePost } from '../../components/BlogTable';
import { BlogSearchBar } from '../../components/BlogSearchBar';
import { BlogStats } from './AdminBlogPage.types';
import styles from './AdminBlogPage.module.scss';

interface AdminBlogPageProps {
  initialStats: BlogStats;
  initialPosts: BlogTablePost[];
  totalPosts: number;
  totalPages: number;
}

export function AdminBlogPage({ 
  initialStats, 
  initialPosts, 
  totalPosts,
  totalPages 
}: AdminBlogPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // Gọi API search
    const res = await blogService.getAdminPosts(1, 10, query);
    setPosts(res.posts);
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
    // Gọi API lấy posts cho page mới
    const res = await blogService.getAdminPosts(page, 10, searchQuery);
    setPosts(res.posts);
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
          value={initialStats.totalViews}
          badge={{ text: initialStats.viewsChange, variant: 'success' }}
        />
        <StatCard
          icon="posts"
          label={t('blog.totalPosts')}
          value={initialStats.totalPosts}
          badge={{ text: t('blog.active'), variant: 'info' }}
        />
        <StatCard
          icon="comments"
          label={t('blog.totalComments')}
          value={initialStats.totalComments}
          badge={{ text: initialStats.commentsTimeRange, variant: 'info' }}
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
