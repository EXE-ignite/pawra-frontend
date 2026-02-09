'use client';

import React, { useState } from 'react';
import { BlogPost } from '../../types';
import { 
  FeaturedPost, 
  ArticleCard, 
  SearchBox, 
  CategoryList, 
  NewsletterBox 
} from '../../components';
import styles from './BlogPage.module.scss';

interface BlogPageProps {
  featuredPost: BlogPost;
  latestPosts: BlogPost[];
}

export function BlogPage({ featuredPost, latestPosts }: BlogPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className={styles.blogPage}>
      <div className={styles.container}>
        {/* Featured Post */}
        <FeaturedPost post={featuredPost} />

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Left Column - Articles */}
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <h2 className={styles.sectionTitle}>Latest Articles</h2>
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
                Load More Articles
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
