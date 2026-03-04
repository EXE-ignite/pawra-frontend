'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PetProfilePage } from '@/modules/pet-owner';
import { PetSwitcher, EditPetModal } from '@/modules/pet-owner/components';
import { petService } from '@/modules/pet-owner/services';
import type { PetProfile, Pet } from '@/modules/pet-owner/types';

export default function PetProfileByIdRoute() {
  const params = useParams();
  const router = useRouter();
  const petId = params.petId as string;

  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!petId) return;

    async function loadData() {
      try {
        setLoading(true);
        const [profile, pets] = await Promise.all([
          petService.getPetProfile(petId),
          petService.getUserPets(),
        ]);
        setPetProfile(profile);
        setAllPets(pets);
      } catch (err: any) {
        console.error('Failed to load pet profile:', err);
        setError(err?.message || 'Không thể tải thông tin thú cưng');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [petId]);

  function handleEditProfile() {
    setIsEditModalOpen(true);
  }

  async function handleEditSuccess() {
    setIsEditModalOpen(false);
    // Reload profile to reflect updated data
    try {
      const [profile, pets] = await Promise.all([
        petService.getPetProfile(petId),
        petService.getUserPets(),
      ]);
      setPetProfile(profile);
      setAllPets(pets);
    } catch (err) {
      console.error('Failed to reload pet profile after edit:', err);
    }
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

  /** Compute approximate ISO birth date from age / ageMonths for pre-filling the edit form */
  function getApproxBirthDate(): string {
    if (!petProfile) return '';
    const today = new Date();
    const year = today.getFullYear() - petProfile.age;
    const month = today.getMonth() - (petProfile.ageMonths ?? 0);
    const approx = new Date(year, month, today.getDate());
    return approx.toISOString().split('T')[0];
  }

  return (
    <>
      <PetSwitcher pets={allPets} activePetId={petId} />
      <PetProfilePage
        petProfile={petProfile}
        onEditProfile={handleEditProfile}
        onExportPdf={handleExportPdf}
        onAddRecord={handleAddRecord}
      />
      {petProfile && (
        <EditPetModal
          isOpen={isEditModalOpen}
          petId={petId}
          initialData={{
            name: petProfile.name,
            species: petProfile.species,
            breed: petProfile.breed,
            birthDate: getApproxBirthDate(),
            color: petProfile.color,
            weight: petProfile.weight,
            description: petProfile.summary,
          }}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
