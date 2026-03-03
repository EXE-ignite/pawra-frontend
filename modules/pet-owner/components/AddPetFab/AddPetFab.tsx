'use client';

import React, { useState } from 'react';
import { AddPetModal } from '../AddPetModal';
import styles from './AddPetFab.module.scss';

export function AddPetFab() {
  const [isOpen, setIsOpen] = useState(false);

  function handleSuccess() {
    window.dispatchEvent(new CustomEvent('pet-added'));
  }

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => setIsOpen(true)}
        aria-label="Thêm thú cưng"
        title="Thêm thú cưng"
      >
        <span className={styles.tooltip}>Thêm thú cưng</span>
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
