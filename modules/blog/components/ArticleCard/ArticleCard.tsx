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
  const categoryColor = categoryColors[post.category] || '#999';

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image 
          src={post.imageUrl}
          alt={post.title}
          width={400}
          height={240}
          className={styles.image}
        />
        <span 
          className={styles.categoryBadge}
          style={{ backgroundColor: categoryColor }}
        >
          {post.category.toUpperCase()}
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
