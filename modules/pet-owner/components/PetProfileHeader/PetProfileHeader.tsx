import React from 'react';
import { PetProfileHeaderProps } from './PetProfileHeader.types';
import styles from './PetProfileHeader.module.scss';

export function PetProfileHeader({
  name,
  breed,
  age,
  ageMonths,
  weight,
  imageUrl,
  onShareProfile,
  onLogEntry,
}: PetProfileHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.petInfo}>
        <div className={styles.petImage}>
          {imageUrl ? (
            <img src={imageUrl} alt={name} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>🐕</div>
          )}
          <span className={styles.onlineStatus}></span>
        </div>
        <div className={styles.details}>
          <h1 className={styles.name}>{name}</h1>
          <div className={styles.attributes}>
            <span className={styles.attribute}>
              <span className={styles.attributeIcon}>🏷️</span>
              {breed}
            </span>
            <span className={styles.attribute}>
              <span className={styles.attributeIcon}>🎂</span>
              {age} Years {ageMonths} Months
            </span>
            <span className={styles.attribute}>
              <span className={styles.attributeIcon}>⚖️</span>
              {weight} kg
            </span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {onShareProfile && (
          <button className={styles.actionButton} onClick={onShareProfile}>
            <span className={styles.buttonIcon}>↗</span>
            Share Profile
          </button>
        )}
        {onLogEntry && (
          <button className={styles.primaryButton} onClick={onLogEntry}>
            <span className={styles.buttonIcon}>+</span>
            Log Entry
          </button>
        )}
      </div>
    </div>
  );
}
