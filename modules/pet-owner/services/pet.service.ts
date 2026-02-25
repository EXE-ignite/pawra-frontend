import { apiService } from '@/modules/shared/services';
import type { Pet, PetProfile } from '../types';
import { vaccinationService } from './vaccination.service';

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

const mockPetProfiles: Record<string, PetProfile> = {
  '1': {
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 4,
    ageMonths: 2,
    weight: 32.5,
    imageUrl: '/images/pets/max.jpg',
    status: 'active',
    color: 'Cream / Honey Gold',
    microchipId: '985112009456122',
    lastVisit: 'Oct 14, 2023',
    insurance: 'PetGuard Platinum',
    summary: 'Max is a gentle, highly energetic Golden Retriever who loves outdoor adventures.',
    hobbies: [
      { label: 'Swimming', color: 'blue' },
      { label: 'Frisbee', color: 'blue' },
      { label: 'Hiking', color: 'orange' },
    ],
    favoriteThings: [
      { label: 'Peanut Butter', color: 'yellow' },
      { label: 'Tennis Balls', color: 'green' },
      { label: 'Belly Rubs', color: 'pink' },
    ],
    vaccinationAlert: 'Bordetella vaccine is due soon. Please schedule a booster.',
    vaccinations: [
      { id: 'v1', name: 'Rabies (3-Year)', dateAdministered: '2023-10-12', expirationDate: '2026-10-11', batchNumber: 'RB-99281', status: 'valid' },
      { id: 'v2', name: 'Distemper/Parvo', dateAdministered: '2023-10-12', expirationDate: '2024-10-11', batchNumber: 'DPV-4431', status: 'valid' },
      { id: 'v3', name: 'Bordetella', dateAdministered: '2023-04-05', expirationDate: '2024-04-04', batchNumber: 'BD-2289', status: 'due-soon' },
    ],
    medications: [
      { id: 'm1', name: 'NexGard Spectra', dosage: '1 chewable monthly', frequency: 'Monthly' },
    ],
    weightHistory: [
      { date: '2024-01-01', weight: 30.4 },
      { date: '2024-04-01', weight: 31.2 },
      { date: '2024-07-01', weight: 32.5 },
    ],
    routine: [
      { id: 'r1', time: '07:30 AM', title: 'Breakfast', description: '1.5 cups dry kibble', completed: true },
      { id: 'r2', time: '08:30 AM', title: 'Morning Walk', description: '30 min walk', completed: false },
      { id: 'r3', time: '06:00 PM', title: 'Dinner', description: '1.5 cups dry kibble', completed: false },
    ],
    documents: [
      { id: 'd1', name: 'Vet_Visit_Oct23.pdf', type: 'pdf', uploadDate: 'Last edited 3 days', size: '2.3 MB' },
    ],
  },
  '2': {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 2,
    ageMonths: 6,
    weight: 4.5,
    imageUrl: '/images/pets/luna.jpg',
    status: 'active',
    color: 'White / Silver',
    summary: 'Luna is a calm and affectionate Persian cat who loves lounging in sunny spots.',
    hobbies: [
      { label: 'Napping', color: 'purple' },
      { label: 'Bird Watching', color: 'blue' },
    ],
    favoriteThings: [
      { label: 'Tuna Treats', color: 'orange' },
      { label: 'Soft Blankets', color: 'pink' },
    ],
    vaccinations: [
      { id: 'v1', name: 'Rabies', dateAdministered: '2024-02-10', expirationDate: '2027-02-10', batchNumber: 'RB-11123', status: 'valid' },
      { id: 'v2', name: 'FVRCP', dateAdministered: '2024-02-10', expirationDate: '2025-02-10', batchNumber: 'FV-8812', status: 'due-soon' },
    ],
    medications: [],
    weightHistory: [
      { date: '2024-01-01', weight: 4.0 },
      { date: '2024-07-01', weight: 4.5 },
    ],
    routine: [],
    documents: [],
  },
  '3': {
    id: '3',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Beagle',
    age: 3,
    ageMonths: 4,
    weight: 12.0,
    imageUrl: '/images/pets/charlie.jpg',
    status: 'active',
    summary: 'Charlie is a curious and playful Beagle who loves sniffing everything on walks.',
    vaccinations: [
      { id: 'v1', name: 'Rabies', dateAdministered: '2023-06-15', expirationDate: '2026-06-15', batchNumber: 'RB-55234', status: 'valid' },
    ],
    medications: [],
    weightHistory: [
      { date: '2024-01-01', weight: 11.5 },
      { date: '2024-07-01', weight: 12.0 },
    ],
    routine: [],
    documents: [],
  },
};

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
    } catch (error: unknown) {
      console.error('Error fetching pets:', (error as any)?.message || error);
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
    } catch (error: unknown) {
      console.error('Error fetching user pets:', (error as any)?.message || error);
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
    } catch (error: unknown) {
      console.error('Error fetching pet by ID:', (error as any)?.message || error);
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
    } catch (error: unknown) {
      console.error('Error creating pet:', (error as any)?.message || error);
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
    } catch (error: unknown) {
      console.error('Error updating pet:', (error as any)?.message || error);
      throw error;
    }
  }

  /**
   * Get full pet profile (Pet + Vaccinations)
   * Combines: GET /api/Pet/{id} + GET /api/VaccinationRecord/pet/{petId}
   */
  async getPetProfile(petId: string): Promise<PetProfile> {
    if (USE_MOCK) {
      const profile = mockPetProfiles[petId];
      if (!profile) throw new Error(`Pet profile not found for id: ${petId}`);
      return profile;
    }

    try {
      // Fetch pet basic info and vaccinations in parallel
      const [petResponse, vaccinations] = await Promise.all([
        apiService.get<PetDto>(`${this.endpoint}/${petId}`),
        vaccinationService.getPetVaccinations(petId).catch(() => []),
      ]);

      const petDto = petResponse.data;
      const birthDate = new Date(petDto.birthDate);
      const today = new Date();
      const ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12
        + (today.getMonth() - birthDate.getMonth());

      const profile: PetProfile = {
        id: petDto.id,
        name: petDto.name,
        species: petDto.species,
        breed: petDto.breed,
        age: calculateAge(petDto.birthDate),
        ageMonths: ageMonths % 12,
        status: 'active',
        vaccinations,
        medications: [],
        weightHistory: [],
        routine: [],
        documents: [],
        // Fields below not in backend yet — kept empty as defaults
        weight: undefined,
        imageUrl: undefined,
        color: undefined,
        microchipId: undefined,
        insurance: undefined,
        summary: undefined,
        lastVisit: undefined,
        hobbies: [],
        favoriteThings: [],
        vaccinationAlert: vaccinations.some(v => v.status === 'overdue' || v.status === 'due-soon')
          ? 'Một số vaccine cần được tiêm nhắc lại. Vui lòng liên hệ phòng khám.'
          : undefined,
      };

      return profile;
    } catch (error: unknown) {
      console.error('Error fetching pet profile:', (error as any)?.message || error);
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
    } catch (error: unknown) {
      console.error('Error deleting pet:', (error as any)?.message || error);
      throw error;
    }
  }
}

export const petService = new PetService();
export default petService;
