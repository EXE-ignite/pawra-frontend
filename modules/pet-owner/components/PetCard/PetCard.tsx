import React from 'react';
import Link from 'next/link';
import { Pet } from '../../types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './PetCard.module.scss';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
}

const SPECIES_EMOJI: Record<string, string> = {
  Dog: '🐕',
  Cat: '🐱',
  Rabbit: '🐰',
  Bird: '🐦',
  Hamster: '🐹',
};

export function PetCard({ pet, onClick }: PetCardProps) {
  const { t } = useTranslation();
  return (
    <Link href={`/pet-owner/profile/${pet.id}`} className={styles.card} onClick={onClick}>
      <div className={styles.petImage}>
        {pet.imageUrl ? (
          <img src={pet.imageUrl} alt={pet.name} className={styles.petAvatar} />
        ) : (
          SPECIES_EMOJI[pet.species] || '🐾'
        )}
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
            {pet.age} {t('petCard.yearsOld')}
          </span>
        </div>
      </div>
    </Link>
  );
}
