'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search API call
    console.log('Search:', query);
  };

  const handleFilter = () => {
    // TODO: Implement filter modal
    console.log('Open filter modal');
  };

  const handleCreate = () => {
    console.log('[DEBUG] Create button clicked, navigating to /admin/blog/create');
    router.push('/admin/blog/create');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // TODO: Fetch posts for new page
    console.log('Change to page:', page);
  };

  const handleView = (postId: string) => {
    // TODO: Navigate to public post view
    router.push(`/blog/${postId}`);
  };

  const handleEdit = (postId: string) => {
    router.push(`/admin/blog/${postId}/edit`);
  };

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      // TODO: Implement delete with blogService
      console.log('Delete post:', postId);
    }
  };

  return (
    <div className={styles.adminBlogPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog Content Overview</h1>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          icon="views"
          label="Total Page Views"
          value={initialStats.totalViews}
          badge={{ text: initialStats.viewsChange, variant: 'success' }}
        />
        <StatCard
          icon="posts"
          label="Total Blog Posts"
          value={initialStats.totalPosts}
          badge={{ text: 'Active', variant: 'info' }}
        />
        <StatCard
          icon="comments"
          label="Total Comments"
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
