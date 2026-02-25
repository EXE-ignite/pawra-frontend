import { apiService } from '@/modules/shared/services';
import type { Pet, PetProfile } from '../types';

// Flag để chuyển đổi giữa mock data và real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * Pet Service
 * Handles all pet CRUD operations
 * 
 * Backend endpoints:
 * - POST /api/Pet/create - Create new pet
 * - GET /api/Pet/{id} - Get pet by ID
 * - PUT /api/Pet/update/{id} - Update pet
 * - DELETE /api/Pet/{id} - Delete pet
 * - GET /api/Pet - Get all pets (paginated)
 */

// Types matching backend DTOs
export interface CreatePetDto {
  customerId: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string; // ISO date string
}

export interface UpdatePetDto {
  name?: string;
  species?: string;
  breed?: string;
  birthDate?: string;
}

export interface PetDto {
  id: string;
  customerId: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Mock data for development
const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 4,
    weight: 32.5,
    imageUrl: '/images/pets/max.jpg'
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 2,
    weight: 4.5,
    imageUrl: '/images/pets/luna.jpg'
  },
  {
    id: '3',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Beagle',
    age: 3,
    weight: 12.0,
    imageUrl: '/images/pets/charlie.jpg'
  }
];

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Transform backend PetDto to frontend Pet type
 */
function transformPetData(petDto: PetDto): Pet {
  return {
    id: petDto.id,
    name: petDto.name,
    species: petDto.species,
    breed: petDto.breed,
    age: calculateAge(petDto.birthDate),
    // weight and imageUrl are not in backend, need to be added later
  };
}

class PetService {
  private readonly endpoint = '/Pet';

  /**
   * Get all pets (paginated)
   * Backend: GET /api/Pet?pageSize=100&pageNumber=1
   */
  async getAllPets(pageSize = 100, pageNumber = 1): Promise<Pet[]> {
    if (USE_MOCK) {
      return mockPets;
    }

    try {
      const response = await apiService.get<PetDto[] | PaginatedResponse<PetDto>>(
        `${this.endpoint}?pageSize=${pageSize}&pageNumber=${pageNumber}`
      );
      
      // Handle both array and paginated response
      const pets = Array.isArray(response.data) 
        ? response.data 
        : response.data?.items || [];
      
      return pets.map(transformPetData);
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  }

  /**
   * Get pets for current user
   * Note: Backend may need endpoint like GET /api/Pet/customer/{customerId}
   * For now, using GET /api/Pet with filtering on frontend
   */
  async getUserPets(): Promise<Pet[]> {
    if (USE_MOCK) {
      return mockPets;
    }

    try {
      // TODO: When backend provides customer-specific endpoint, use it
      // For now, fetch all pets (assuming backend filters by auth token)
      const response = await apiService.get<PetDto[]>(`${this.endpoint}`);
      const pets = Array.isArray(response.data) ? response.data : [];
      return pets.map(transformPetData);
    } catch (error) {
      console.error('Error fetching user pets:', error);
      throw error;
    }
  }

  /**
   * Get pet by ID
   * Backend: GET /api/Pet/{id}
   */
  async getPetById(id: string): Promise<Pet> {
    if (USE_MOCK) {
      const pet = mockPets.find(p => p.id === id);
      if (!pet) throw new Error('Pet not found');
      return pet;
    }

    try {
      const response = await apiService.get<PetDto>(`${this.endpoint}/${id}`);
      return transformPetData(response.data);
    } catch (error) {
      console.error('Error fetching pet by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new pet
   * Backend: POST /api/Pet/create
   */
  async createPet(data: {
    name: string;
    species: string;
    breed: string;
    birthDate: Date | string;
    customerId?: string;
  }): Promise<Pet> {
    if (USE_MOCK) {
      const newPet: Pet = {
        id: String(Date.now()),
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: calculateAge(data.birthDate instanceof Date ? data.birthDate.toISOString() : data.birthDate),
      };
      mockPets.push(newPet);
      return newPet;
    }

    try {
      const createDto: CreatePetDto = {
        customerId: data.customerId || '', // Should come from auth context
        name: data.name,
        species: data.species,
        breed: data.breed,
        birthDate: data.birthDate instanceof Date 
          ? data.birthDate.toISOString() 
          : data.birthDate,
      };

      const response = await apiService.post<PetDto>(`${this.endpoint}/create`, createDto);
      return transformPetData(response.data);
    } catch (error) {
      console.error('Error creating pet:', error);
      throw error;
    }
  }

  /**
   * Update a pet
   * Backend: PUT /api/Pet/update/{id}
   */
  async updatePet(id: string, data: Partial<{
    name: string;
    species: string;
    breed: string;
    birthDate: Date | string;
  }>): Promise<Pet> {
    if (USE_MOCK) {
      const petIndex = mockPets.findIndex(p => p.id === id);
      if (petIndex === -1) throw new Error('Pet not found');
      
      mockPets[petIndex] = { ...mockPets[petIndex], ...data };
      return mockPets[petIndex];
    }

    try {
      const updateDto: UpdatePetDto = {};
      
      if (data.name) updateDto.name = data.name;
      if (data.species) updateDto.species = data.species;
      if (data.breed) updateDto.breed = data.breed;
      if (data.birthDate) {
        updateDto.birthDate = data.birthDate instanceof Date 
          ? data.birthDate.toISOString() 
          : data.birthDate;
      }

      const response = await apiService.put<PetDto>(`${this.endpoint}/update/${id}`, updateDto);
      return transformPetData(response.data);
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  }

  /**
   * Delete a pet
   * Backend: DELETE /api/Pet/{id}
   */
  async deletePet(id: string): Promise<void> {
    if (USE_MOCK) {
      const petIndex = mockPets.findIndex(p => p.id === id);
      if (petIndex === -1) throw new Error('Pet not found');
      mockPets.splice(petIndex, 1);
      return;
    }

    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  }
}

export const petService = new PetService();
export default petService;
