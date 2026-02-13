import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RelatedPostsProps } from './RelatedPosts.types';
import styles from './RelatedPosts.module.scss';

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className={styles.relatedPosts}>
      <div className={styles.header}>
        <span className={styles.icon}>⭐</span>
        <h3 className={styles.title}>Related Posts</h3>
      </div>
      <div className={styles.posts}>
        {posts.slice(0, 3).map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.id}`}
            className={styles.postItem}
          >
            <div className={styles.thumbnail}>
              {post.imageUrl ? (
                <Image 
                  src={post.imageUrl}
                  alt={post.title}
                  width={80}
                  height={80}
                  className={styles.image}
                />
              ) : (
                <div style={{ width: '80px', height: '80px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#999' }}>No img</span>
                </div>
              )}
            </div>
            <div className={styles.postInfo}>
              <h4 className={styles.postTitle}>{post.title}</h4>
              <div className={styles.readTime}>{post.readTime} min read</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
