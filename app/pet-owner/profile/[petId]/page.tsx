'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PetProfilePage } from '@/modules/pet-owner';
import { PetSwitcher, EditPetModal, AddVaccinationModal } from '@/modules/pet-owner/components';
import { petService } from '@/modules/pet-owner/services';
import { ConfirmModal } from '@/modules/shared/components';
import { useTranslation } from '@/modules/shared/contexts';
import type { PetProfile, Pet } from '@/modules/pet-owner/types';

export default function PetProfileByIdRoute() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const petId = params.petId as string;

  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddVaccinationOpen, setIsAddVaccinationOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        setError(err?.message || t('common.loadError'));
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

  async function handleDeleteConfirm() {
    try {
      setDeleteLoading(true);
      await petService.deletePet(petId);
      setIsDeleteModalOpen(false);
      router.push('/pet-owner');
    } catch (err: any) {
      console.error('Failed to delete pet:', err);
      setIsDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleExportPdf() {
    console.log('Export PDF:', petId);
  }

  function handleAddRecord() {
    setIsAddVaccinationOpen(true);
  }

  async function handleVaccinationSuccess() {
    setIsAddVaccinationOpen(false);
    // Reload profile to refresh vaccination list
    try {
      const profile = await petService.getPetProfile(petId);
      setPetProfile(profile);
    } catch (err) {
      console.error('Failed to reload profile after vaccination:', err);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !petProfile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error || t('petProfile.notFound')}</p>
        <button onClick={() => router.back()} style={{ marginTop: '1rem' }}>
          {t('common.back')}
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
        onDeletePet={() => setIsDeleteModalOpen(true)}
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
          }}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
      <AddVaccinationModal
        isOpen={isAddVaccinationOpen}
        onClose={() => setIsAddVaccinationOpen(false)}
        onSuccess={handleVaccinationSuccess}
        petId={petId}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t('petProfile.deletePetTitle')}
        message={t('petProfile.deletePetMessage', { name: petProfile?.name ?? '' })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
