import React from 'react';
import { CategoryInfo } from '../../types';
import styles from './CategoryList.module.scss';

const categories: CategoryInfo[] = [
  { id: 'health', label: 'Health', icon: '❤️', color: '#EF476F' },
  { id: 'nutrition', label: 'Nutrition', icon: '🍴', color: '#AAC4FF' },
  { id: 'training', label: 'Training', icon: '🎯', color: '#06D6A0' },
  { id: 'behavior', label: 'Behavior', icon: '🐾', color: '#B1B2FF' },
  { id: 'grooming', label: 'Grooming', icon: '✂️', color: '#D2DAFF' }
];

export function CategoryList() {
  return (
    <div className={styles.categoryList}>
      <h3 className={styles.title}>Popular Categories</h3>
      <div className={styles.categories}>
        {categories.map((category) => (
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
            <span className={styles.label}>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
