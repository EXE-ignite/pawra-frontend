'use client';

import React from 'react';
import Link from 'next/link';
import { Pet } from '../../types';
import styles from './PetSwitcher.module.scss';

interface PetSwitcherProps {
  pets: Pet[];
  activePetId: string;
}

const SPECIES_EMOJI: Record<string, string> = {
  Dog: '🐕',
  Cat: '🐱',
  Rabbit: '🐰',
  Bird: '🐦',
  Hamster: '🐹',
};

export function PetSwitcher({ pets, activePetId }: PetSwitcherProps) {
  if (pets.length <= 1) return null;

  return (
    <>
      <nav className={styles.switcher}>
        {pets.map(pet => (
          <Link
            key={pet.id}
            href={`/pet-owner/profile/${pet.id}`}
            className={`${styles.tab} ${pet.id === activePetId ? styles.active : ''}`}
          >
            <span className={styles.avatar}>
              {pet.imageUrl ? (
                <img src={pet.imageUrl} alt={pet.name} className={styles.avatarImg} />
              ) : (
                SPECIES_EMOJI[pet.species] || '🐾'
              )}
            </span>
            {pet.name}
          </Link>
        ))}
      </nav>
      <div className={styles.divider} />
    </>
  );
}
