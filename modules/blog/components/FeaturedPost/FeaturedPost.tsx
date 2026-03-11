'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturedPostProps } from './FeaturedPost.types';
import { BlogShare } from '../BlogShare';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './FeaturedPost.module.scss';

export function FeaturedPost({ post }: FeaturedPostProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.featuredPost}>
      <div className={styles.imageWrapper}>
        {post.imageUrl ? (
          <Image 
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={300}
            className={styles.image}
          />
        ) : (
          <div style={{ width: '400px', height: '300px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#999' }}>{t('blog.noImage')}</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.badge}>{t('blog.featuredLabel')}</span>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <span className={styles.readTime}>{post.readTime} {t('blog.minRead')}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.date}>{post.publishedAt}</span>
        </div>
        <div className={styles.actions}>
          <Link href={`/blog/${post.id}`} className={styles.readMore}>
            {t('blog.readMore')}
          </Link>
          <BlogShare
            post={{
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
            }}
            variant="icon"
          />
        </div>
      </div>
    </div>
  );
}
