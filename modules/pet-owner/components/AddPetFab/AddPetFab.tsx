'use client';

import React, { useState, useEffect } from 'react';
import { AddPetModal } from '../AddPetModal';
import { useTranslation } from '@/modules/shared/contexts';
import { useSubscription } from '@/modules/shared/contexts';
import { petService } from '../../services';
import styles from './AddPetFab.module.scss';

export function AddPetFab() {
  const { t } = useTranslation();
  const { maxPets, currentPlan } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [petCount, setPetCount] = useState<number | null>(null);

  useEffect(() => {
    petService.getUserPets()
      .then(pets => setPetCount(pets.length))
      .catch(() => setPetCount(null));
  }, []);

  // Listen for pet-added/pet-deleted events to keep count in sync
  useEffect(() => {
    function handlePetAdded() { setPetCount(prev => (prev ?? 0) + 1); }
    function handlePetDeleted() { setPetCount(prev => Math.max(0, (prev ?? 1) - 1)); }
    window.addEventListener('pet-added', handlePetAdded);
    window.addEventListener('pet-deleted', handlePetDeleted);
    return () => {
      window.removeEventListener('pet-added', handlePetAdded);
      window.removeEventListener('pet-deleted', handlePetDeleted);
    };
  }, []);

  function handleSuccess() {
    window.dispatchEvent(new CustomEvent('pet-added'));
  }

  const isAtLimit = petCount !== null && isFinite(maxPets) && petCount >= maxPets;
  const limitLabel = isFinite(maxPets)
    ? `Gói ${currentPlan} cho phép tối đa ${maxPets} thú cưng. Nâng cấp để thêm.`
    : t('addPetFab.addPet');

  return (
    <>
      <button
        className={`${styles.fab} ${isAtLimit ? styles.fabLocked : ''}`}
        onClick={() => !isAtLimit && setIsOpen(true)}
        aria-label={isAtLimit ? limitLabel : t('addPetFab.addPet')}
        title={isAtLimit ? limitLabel : t('addPetFab.addPet')}
        disabled={isAtLimit}
      >
        <span className={styles.tooltip}>
          {isAtLimit ? limitLabel : t('addPetFab.addPet')}
        </span>
        {isAtLimit ? '🔒' : '+'}
      </button>

      <AddPetModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
