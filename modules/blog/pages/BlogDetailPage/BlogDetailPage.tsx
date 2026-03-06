'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogDetailPageProps } from './BlogDetailPage.types';
import { RelatedPosts, CommentSection, SearchBox, NewsletterBox, ReactionBar } from '../../components';
import { ReactionType, Reaction } from '../../components/ReactionBar/ReactionBar.types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './BlogDetailPage.module.scss';

const categoryColors: Record<string, string> = {
  behavior: '#B1B2FF',
  nutrition: '#AAC4FF',
  grooming: '#D2DAFF',
  training: '#06D6A0'
};

export function BlogDetailPage({ post, relatedPosts }: BlogDetailPageProps) {
  const { t } = useTranslation();
  // Ensure post has all required fields with defaults
  const safePost = {
    ...post,
    id: post.id || '',
    title: post.title || 'Untitled',
    slug: post.slug || '',
    category: post.category || 'health',
    imageUrl: post.imageUrl || '',
    publishedAt: post.publishedAt || new Date().toISOString(),
    readTime: post.readTime || 5,
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: {
      name: post.author?.name || 'Unknown Author',
      avatar: post.author?.avatar || '',
    },
    reactionSummary: post.reactionSummary || {},
  };

  // Convert reactionSummary to Reaction[]
  const reactionTypes: ReactionType[] = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
  const initialReactions: Reaction[] = reactionTypes.map(type => ({
    type,
    emoji: '', // ReactionBar will fill emoji
    label: '', // ReactionBar will fill label
    count: safePost.reactionSummary?.[type] || 0,
  }));
  
  const categoryColor = categoryColors[safePost.category] || '#B1B2FF';

  return (
    <div className={styles.detailPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">{ t('blog.home') }</Link>
          <span className={styles.separator}>›</span>
          <Link href="/blog">Blog</Link>
          <span className={styles.separator}>›</span>
          <span>{safePost.title}</span>
        </nav>

        {/* Hero Image */}
        <div className={styles.heroImage}>
          {safePost.imageUrl ? (
            <Image 
              src={safePost.imageUrl}
              alt={safePost.title}
              width={1200}
              height={500}
              className={styles.image}
              priority
            />
          ) : (
            <div style={{ width: '100%', height: '500px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#999', fontSize: '1.2rem' }}>{t('blog.noImageAvailable')}</span>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Main Content */}
          <article className={styles.mainContent}>
            {/* Category Badge */}
            <span 
              className={styles.categoryBadge}
              style={{ backgroundColor: categoryColor }}
            >
              {safePost.category.toUpperCase()}
            </span>

            {/* Title */}
            <h1 className={styles.title}>{safePost.title}</h1>

            {/* Author Info */}
            <div className={styles.authorSection}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>
                  {safePost.author.name.charAt(0)}
                </div>
                <div className={styles.authorDetails}>
                  <div className={styles.authorName}>{safePost.author.name}</div>
                  <div className={styles.meta}>
                    {t('blog.veterinarySpecialist')} • {safePost.publishedAt} • {safePost.readTime} {t('blog.minRead')}
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.actionBtn} aria-label="Bookmark">
                  🔖
                </button>
                <button className={styles.actionBtn} aria-label="Share">
                  🔗
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className={styles.content}>
              <p className={styles.intro}>{safePost.excerpt}</p>
              
              <div dangerouslySetInnerHTML={{ __html: safePost.content }} />
            </div>

            {/* Tags */}
            <div className={styles.tags}>
              <button className={styles.tag}>#CatCare</button>
              <button className={styles.tag}>#PetHealth</button>
              <button className={styles.tag}>#Nutrition</button>
              <button className={styles.tag}>#FelineNutrition</button>
            </div>


            {/* Reaction Bar */}
            <ReactionBar postId={safePost.id} initialReactions={initialReactions} />

            {/* Share Section */}
            <div className={styles.shareSection}>
              <h3 className={styles.shareTitle}>{t('blog.shareArticle')}</h3>
              <div className={styles.socialButtons}>
                <button className={styles.socialBtn} aria-label="Share on Facebook">
                  f
                </button>
                <button className={styles.socialBtn} aria-label="Share on Twitter">
                  𝕏
                </button>
                <button className={styles.socialBtn} aria-label="Share on Pinterest">
                  P
                </button>
              </div>
            </div>

            {/* Comments */}
            <CommentSection postId={safePost.id} />
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <SearchBox />
            <RelatedPosts posts={relatedPosts} />
            <NewsletterBox />
          </aside>
        </div>
      </div>
    </div>
  );
}
