'use client';

import React from 'react';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './CategoryList.module.scss';

const categoryKeys: Array<{ id: string; icon: string; color: string; labelKey: string }> = [
  { id: 'health', icon: '❤️', color: '#EF476F', labelKey: 'blog.catHealth' },
  { id: 'nutrition', icon: '🍴', color: '#AAC4FF', labelKey: 'blog.catNutrition' },
  { id: 'training', icon: '🎯', color: '#06D6A0', labelKey: 'blog.catTraining' },
  { id: 'behavior', icon: '🐾', color: '#B1B2FF', labelKey: 'blog.catBehavior' },
  { id: 'grooming', icon: '✂️', color: '#D2DAFF', labelKey: 'blog.catGrooming' },
];

export function CategoryList() {
  const { t } = useTranslation();
  return (
    <div className={styles.categoryList}>
      <h3 className={styles.title}>{t('blog.popularCategories')}</h3>
      <div className={styles.categories}>
        {categoryKeys.map((category) => (
          <button 
            key={category.id}
            className={styles.categoryItem}
          >
            <span 
              className={styles.icon}
              style={{ color: category.color }}
            >
              {category.icon}
            </span>
            <span className={styles.label}>{t(category.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
