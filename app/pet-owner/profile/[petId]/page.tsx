'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PetProfilePage } from '@/modules/pet-owner';
import { petService } from '@/modules/pet-owner/services';
import type { PetProfile } from '@/modules/pet-owner/types';

export default function PetProfileByIdRoute() {
  const params = useParams();
  const router = useRouter();
  const petId = params.petId as string;

  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) return;

    async function loadPetProfile() {
      try {
        setLoading(true);
        const profile = await petService.getPetProfile(petId);
        setPetProfile(profile);
      } catch (err: any) {
        console.error('Failed to load pet profile:', err);
        setError(err?.message || 'Không thể tải thông tin thú cưng');
      } finally {
        setLoading(false);
      }
    }

    loadPetProfile();
  }, [petId]);

  function handleEditProfile() {
    console.log('Edit profile:', petId);
  }

  function handleExportPdf() {
    console.log('Export PDF:', petId);
  }

  function handleAddRecord() {
    console.log('Add vaccination record for:', petId);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error || !petProfile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error || 'Không tìm thấy thú cưng'}</p>
        <button onClick={() => router.back()} style={{ marginTop: '1rem' }}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <PetProfilePage
      petProfile={petProfile}
      onEditProfile={handleEditProfile}
      onExportPdf={handleExportPdf}
      onAddRecord={handleAddRecord}
    />
  );
}
