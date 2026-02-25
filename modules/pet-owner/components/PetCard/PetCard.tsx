import React from 'react';
import Link from 'next/link';
import { Pet } from '../../types';
import styles from './PetCard.module.scss';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
}

export function PetCard({ pet, onClick }: PetCardProps) {
  return (
    <Link href={`/pet-owner/profile/${pet.id}`} className={styles.card} onClick={onClick}>
      <div className={styles.petImage}>
        {pet.species === 'Dog' ? '🐕' : '🐱'}
      </div>
      <div className={styles.petInfo}>
        <h3 className={styles.petName}>{pet.name}</h3>
        <div className={styles.petDetails}>
          <span className={styles.petDetail}>
            <span className={styles.detailIcon}>🏷️</span>
            {pet.breed}
          </span>
          <span className={styles.petDetail}>
            <span className={styles.detailIcon}>🎂</span>
            {pet.age} years old
          </span>
        </div>
      </div>
    </Link>
  );
}
