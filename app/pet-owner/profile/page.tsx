'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { petService } from '@/modules/pet-owner/services';

/**
 * Default profile page - loads the first pet and redirects.
 * For a specific pet, navigate to /pet-owner/profile/[petId]
 */
export default function PetProfilePageRoute() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function redirectToFirstPet() {
      try {
        const pets = await petService.getUserPets();

        if (pets.length === 0) {
          setError('Bạn chưa có thú cưng nào. Hãy thêm thú cưng đầu tiên!');
          return;
        }

        router.replace(`/pet-owner/profile/${pets[0].id}`);
      } catch (err: any) {
        console.error('Failed to load pets:', err);
        setError(err?.message || 'Không thể tải danh sách thú cưng');
      }
    }

    redirectToFirstPet();
  }, [router]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <p>Đang tải...</p>
    </div>
  );
}
