import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogDetailPageProps } from './BlogDetailPage.types';
import { RelatedPosts, CommentSection, SearchBox, NewsletterBox, ReactionBar } from '../../components';
import styles from './BlogDetailPage.module.scss';

const categoryColors: Record<string, string> = {
  behavior: '#B1B2FF',
  nutrition: '#AAC4FF',
  grooming: '#D2DAFF',
  health: '#EF476F',
  training: '#06D6A0'
};

export function BlogDetailPage({ post, relatedPosts }: BlogDetailPageProps) {
  const categoryColor = categoryColors[post.category] || '#B1B2FF';

  return (
    <div className={styles.detailPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span className={styles.separator}>›</span>
          <Link href="/blog">Blog</Link>
          <span className={styles.separator}>›</span>
          <span>{post.title}</span>
        </nav>

        {/* Hero Image */}
        <div className={styles.heroImage}>
          <Image 
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={500}
            className={styles.image}
            priority
          />
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
              {post.category.toUpperCase()}
            </span>

            {/* Title */}
            <h1 className={styles.title}>{post.title}</h1>

            {/* Author Info */}
            <div className={styles.authorSection}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>
                  {post.author.name.charAt(0)}
                </div>
                <div className={styles.authorDetails}>
                  <div className={styles.authorName}>{post.author.name}</div>
                  <div className={styles.meta}>
                    Veterinary Specialist • {post.publishedAt} • {post.readTime} min read
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
              <p className={styles.intro}>{post.excerpt}</p>
              
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            <div className={styles.tags}>
              <button className={styles.tag}>#CatCare</button>
              <button className={styles.tag}>#PetHealth</button>
              <button className={styles.tag}>#Nutrition</button>
              <button className={styles.tag}>#FelineNutrition</button>
            </div>

            {/* Reaction Bar */}
            <ReactionBar postId={post.id} />

            {/* Share Section */}
            <div className={styles.shareSection}>
              <h3 className={styles.shareTitle}>SHARE THIS ARTICLE</h3>
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
            <CommentSection postId={post.id} />
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
