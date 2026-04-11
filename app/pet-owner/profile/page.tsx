'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { petService } from '@/modules/pet-owner/services';
import { AddPetModal } from '@/modules/pet-owner/components';
import { Button } from '@/modules/shared';
import { useTranslation } from '@/modules/shared/contexts';

export default function PetProfilePageRoute() {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function redirectToFirstPet() {
      try {
        const pets = await petService.getUserPets();

        if (pets.length === 0) {
          setLoaded(true);
          return;
        }

        router.replace(`/pet-owner/profile/${pets[0].id}`);
      } catch (err: any) {
        console.error('Failed to load pets:', err);
        setError(err?.message || t('common.loadError'));
        setLoaded(true);
      }
    }

    redirectToFirstPet();
  }, [router]);

  function handlePetAdded() {
    // Reload pets list after adding
    setLoaded(false);
    setShowAddModal(false);
    setError(null);
    petService.getUserPets().then(pets => {
      if (pets.length > 0) {
        router.replace(`/pet-owner/profile/${pets[0].id}`);
      } else {
        setLoaded(true);
      }
    });
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐾</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {t('dashboard.noPets')}
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          {t('dashboard.noPetsDesc')}
        </p>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + {t('dashboard.addFirstPet')}
        </Button>
      </div>

      <AddPetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handlePetAdded}
      />
    </>
  );
}
