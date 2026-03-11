'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import { 
  FeaturedPost, 
  ArticleCard, 
  SearchBox, 
  CategoryList, 
  NewsletterBox 
} from '../../components';
import { useTranslation } from '@/modules/shared/contexts';
import { blogService } from '../../services/blog.service';
import styles from './BlogPage.module.scss';

export function BlogPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getPublishedBlogPosts({ page: 1, pageSize: 10 })
      .then((response) => {
        const posts = response?.posts || [];
        setLatestPosts(posts);
        setFeaturedPost(posts[0] || null);
      })
      .catch((err) => console.error('[BlogPage] Failed to load posts:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.blogPage}>
      <div className={styles.container}>
        {/* Featured Post */}
        {featuredPost && <FeaturedPost post={featuredPost} />}

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Left Column - Articles */}
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <h2 className={styles.sectionTitle}>{t('blog.latestArticles')}</h2>
              <div className={styles.viewToggle}>
                <button 
                  className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  ⊞
                </button>
                <button 
                  className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  ☰
                </button>
              </div>
            </div>

            <div className={`${styles.articlesGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
              {latestPosts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>

            <div className={styles.loadMore}>
              <button className={styles.loadMoreBtn}>
                {t('blog.loadMore')}
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className={styles.sidebar}>
            <SearchBox />
            <CategoryList />
            <NewsletterBox />
          </aside>
        </div>
      </div>
    </div>
  );
}
