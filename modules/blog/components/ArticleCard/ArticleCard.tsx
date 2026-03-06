import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleCardProps } from './ArticleCard.types';
import styles from './ArticleCard.module.scss';

const categoryColors: Record<string, string> = {
  behavior: '#B1B2FF',
  nutrition: '#AAC4FF',
  grooming: '#D2DAFF',
  health: '#EF476F',
  training: '#06D6A0'
};

export function ArticleCard({ post }: ArticleCardProps) {
  const categoryStr = typeof post.category === 'string' ? post.category : (post.category as any)?.name || (post.category as any)?.slug || 'health';
  const categoryColor = categoryColors[categoryStr] || '#999';

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {post.imageUrl ? (
          <Image 
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={240}
            className={styles.image}
          />
        ) : (
          <div style={{ width: '400px', height: '240px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#999' }}>No image</span>
          </div>
        )}
        <span 
          className={styles.categoryBadge}
          style={{ backgroundColor: categoryColor }}
        >
          {categoryStr.toUpperCase()}
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.footer}>
          <span className={styles.readTime}>{post.readTime} min read</span>
          <Link href={`/blog/${post.id}`} className={styles.readLink}>
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
