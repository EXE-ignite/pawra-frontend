import { apiService } from '@/modules/shared/services';
import type { Pet } from '../types';

export type CreatePetRequest = {
  name: string;
  species: string;
  breed: string;
  age: number;
};

export type UpdatePetRequest = CreatePetRequest;

export async function createPet(payload: CreatePetRequest): Promise<Pet> {
  const res = await apiService.post<Pet>('/Pet/create', payload);
  return res.data;
}

export async function updatePet(id: string, payload: UpdatePetRequest): Promise<Pet> {
  const res = await apiService.put<Pet>(`/Pet/update/${id}`, payload);
  return res.data;
}

export async function deletePet(id: string): Promise<void> {
  await apiService.delete(`/Pet/${id}`);
}

