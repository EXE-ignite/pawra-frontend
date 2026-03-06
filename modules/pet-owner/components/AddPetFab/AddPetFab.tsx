'use client';

import React, { useState } from 'react';
import { AddPetModal } from '../AddPetModal';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './AddPetFab.module.scss';

export function AddPetFab() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  function handleSuccess() {
    window.dispatchEvent(new CustomEvent('pet-added'));
  }

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => setIsOpen(true)}
        aria-label={t('addPetFab.addPet')}
        title={t('addPetFab.addPet')}
      >
        <span className={styles.tooltip}>{t('addPetFab.addPet')}</span>
        +
      </button>

      <AddPetModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
