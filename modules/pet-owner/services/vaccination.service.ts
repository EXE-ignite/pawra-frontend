import { apiService } from '@/modules/shared/services';
import type { Vaccination } from '../types';

// Flag để chuyển đổi giữa mock data và real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * Vaccination Service
 * Handles vaccination records and vaccine management
 * 
 * Backend endpoints:
 * - POST /api/VaccinationRecord/create - Create vaccination record
 * - GET /api/VaccinationRecord/{id} - Get vaccination record by ID
 * - PUT /api/VaccinationRecord/update/{id} - Update vaccination record
 * - DELETE /api/VaccinationRecord/{id} - Delete vaccination record
 * - GET /api/Vaccine - Get all vaccines (paginated)
 * - GET /api/Vaccine/{id} - Get vaccine by ID
 */

// Types matching backend DTOs
export interface CreateVaccinationRecordDto {
  petId: string;
  vaccineId: string;
  clinicId: string;
  vaccinationDate: string; // ISO date
}

export interface UpdateVaccinationRecordDto {
  vaccinationDate?: string;
}

export interface VaccinationRecordDto {
  id: string;
  petId: string;
  vaccineId: string;
  vaccine?: VaccineDto;
  clinicId: string;
  clinic?: {
    id: string;
    name: string;
  };
  vaccinationDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VaccineDto {
  id: string;
  name: string;
  manufacturer: string;
}

export interface CreateVaccineDto {
  name: string;
  manufacturer: string;
}

export interface UpdateVaccineDto {
  name?: string;
  manufacturer?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Mock data
const mockVaccinations: Vaccination[] = [
  {
    id: '1',
    name: 'Rabies (3-Year)',
    dateAdministered: '2023-10-12',
    expirationDate: '2026-10-11',
    batchNumber: 'RB-99281',
    status: 'valid',
  },
  {
    id: '2',
    name: 'Distemper/Parvo',
    dateAdministered: '2023-10-12',
    expirationDate: '2024-10-11',
    batchNumber: 'DPV-4431',
    status: 'valid',
  },
  {
    id: '3',
    name: 'Bordetella',
    dateAdministered: '2023-04-05',
    expirationDate: '2024-04-04',
    batchNumber: 'BD-2289',
    status: 'due-soon',
  },
];

const mockVaccines: VaccineDto[] = [
  { id: 'v1', name: 'Rabies (3-Year)', manufacturer: 'Zoetis' },
  { id: 'v2', name: 'Distemper/Parvo', manufacturer: 'Merck' },
  { id: 'v3', name: 'Bordetella', manufacturer: 'Elanco' },
  { id: 'v4', name: 'Leptospirosis', manufacturer: 'Zoetis' },
  { id: 'v5', name: 'Lyme Disease', manufacturer: 'Merck' },
];

/**
 * Calculate vaccination status based on expiration date
 */
function calculateVaccinationStatus(expirationDate: string): Vaccination['status'] {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const daysUntilExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration < 0) {
    return 'overdue';
  } else if (daysUntilExpiration <= 30) {
    return 'due-soon';
  } else {
    return 'valid';
  }
}

/**
 * Estimate expiration date (1 year from vaccination by default)
 */
function estimateExpirationDate(vaccinationDate: string, vaccineName?: string): string {
  const vaccDate = new Date(vaccinationDate);
  
  // 3-year vaccines
  if (vaccineName?.toLowerCase().includes('3-year') || vaccineName?.toLowerCase().includes('rabies')) {
    vaccDate.setFullYear(vaccDate.getFullYear() + 3);
  } else {
    // Default to 1 year
    vaccDate.setFullYear(vaccDate.getFullYear() + 1);
  }
  
  return vaccDate.toISOString().split('T')[0];
}

/**
 * Transform backend VaccinationRecordDto to frontend Vaccination type
 */
function transformVaccinationData(record: VaccinationRecordDto): Vaccination {
  const expirationDate = estimateExpirationDate(record.vaccinationDate, record.vaccine?.name);
  
  return {
    id: record.id,
    name: record.vaccine?.name || 'Unknown Vaccine',
    dateAdministered: record.vaccinationDate.split('T')[0],
    expirationDate,
    batchNumber: '', // Not in backend DTO - would need to be added
    status: calculateVaccinationStatus(expirationDate),
  };
}

class VaccinationService {
  private readonly recordEndpoint = '/VaccinationRecord';
  private readonly vaccineEndpoint = '/Vaccine';

  /**
   * Get all vaccines available
   * Backend: GET /api/Vaccine?pageSize=100&pageNumber=1
   */
  async getVaccines(pageSize = 100, pageNumber = 1): Promise<VaccineDto[]> {
    if (USE_MOCK) {
      return mockVaccines;
    }

    try {
      const response = await apiService.get<VaccineDto[] | PaginatedResponse<VaccineDto>>(
        `${this.vaccineEndpoint}?pageSize=${pageSize}&pageNumber=${pageNumber}`
      );
      
      return Array.isArray(response.data) 
        ? response.data 
        : response.data?.items || [];
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      throw error;
    }
  }

  /**
   * Get vaccine by ID
   * Backend: GET /api/Vaccine/{id}
   */
  async getVaccineById(id: string): Promise<VaccineDto> {
    if (USE_MOCK) {
      const vaccine = mockVaccines.find(v => v.id === id);
      if (!vaccine) throw new Error('Vaccine not found');
      return vaccine;
    }

    try {
      const response = await apiService.get<VaccineDto>(`${this.vaccineEndpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vaccine by ID:', error);
      throw error;
    }
  }

  /**
   * Get vaccination records for a pet
   * Backend: GET /api/VaccinationRecord/pet/{petId}
   */
  async getPetVaccinations(petId: string): Promise<Vaccination[]> {
    if (USE_MOCK) {
      return mockVaccinations;
    }

    try {
      const response = await apiService.get<VaccinationRecordDto[]>(
        `${this.recordEndpoint}/pet/${petId}`
      );
      const records = Array.isArray(response.data) ? response.data : [];
      return records.map(transformVaccinationData);
    } catch (error: unknown) {
      console.error('Error fetching pet vaccinations:', (error as any)?.message || error);
      throw error;
    }
  }

  /**
   * Get vaccination record by ID
   * Backend: GET /api/VaccinationRecord/{id}
   */
  async getVaccinationById(id: string): Promise<Vaccination> {
    if (USE_MOCK) {
      const vaccination = mockVaccinations.find(v => v.id === id);
      if (!vaccination) throw new Error('Vaccination not found');
      return vaccination;
    }

    try {
      const response = await apiService.get<VaccinationRecordDto>(`${this.recordEndpoint}/${id}`);
      return transformVaccinationData(response.data);
    } catch (error) {
      console.error('Error fetching vaccination by ID:', error);
      throw error;
    }
  }

  /**
   * Create a vaccination record
   * Backend: POST /api/VaccinationRecord/create
   */
  async createVaccinationRecord(data: {
    petId: string;
    vaccineId: string;
    clinicId: string;
    vaccinationDate: Date | string;
  }): Promise<Vaccination> {
    if (USE_MOCK) {
      const vaccine = mockVaccines.find(v => v.id === data.vaccineId);
      const dateStr = data.vaccinationDate instanceof Date 
        ? data.vaccinationDate.toISOString().split('T')[0]
        : data.vaccinationDate;
      
      const newVaccination: Vaccination = {
        id: String(Date.now()),
        name: vaccine?.name || 'Unknown',
        dateAdministered: dateStr,
        expirationDate: estimateExpirationDate(dateStr, vaccine?.name),
        batchNumber: `MOCK-${Date.now()}`,
        status: 'valid',
      };
      mockVaccinations.push(newVaccination);
      return newVaccination;
    }

    try {
      const createDto: CreateVaccinationRecordDto = {
        petId: data.petId,
        vaccineId: data.vaccineId,
        clinicId: data.clinicId,
        vaccinationDate: data.vaccinationDate instanceof Date 
          ? data.vaccinationDate.toISOString() 
          : data.vaccinationDate,
      };

      const response = await apiService.post<VaccinationRecordDto>(
        `${this.recordEndpoint}/create`, 
        createDto
      );
      return transformVaccinationData(response.data);
    } catch (error) {
      console.error('Error creating vaccination record:', error);
      throw error;
    }
  }

  /**
   * Update a vaccination record
   * Backend: PUT /api/VaccinationRecord/update/{id}
   */
  async updateVaccinationRecord(id: string, data: {
    vaccinationDate?: Date | string;
  }): Promise<Vaccination> {
    if (USE_MOCK) {
      const index = mockVaccinations.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Vaccination not found');
      
      if (data.vaccinationDate) {
        const dateStr = data.vaccinationDate instanceof Date 
          ? data.vaccinationDate.toISOString().split('T')[0]
          : data.vaccinationDate;
        mockVaccinations[index].dateAdministered = dateStr;
        mockVaccinations[index].expirationDate = estimateExpirationDate(dateStr);
        mockVaccinations[index].status = calculateVaccinationStatus(mockVaccinations[index].expirationDate);
      }
      
      return mockVaccinations[index];
    }

    try {
      const updateDto: UpdateVaccinationRecordDto = {};
      
      if (data.vaccinationDate) {
        updateDto.vaccinationDate = data.vaccinationDate instanceof Date 
          ? data.vaccinationDate.toISOString() 
          : data.vaccinationDate;
      }

      const response = await apiService.put<VaccinationRecordDto>(
        `${this.recordEndpoint}/update/${id}`, 
        updateDto
      );
      return transformVaccinationData(response.data);
    } catch (error) {
      console.error('Error updating vaccination record:', error);
      throw error;
    }
  }

  /**
   * Delete a vaccination record
   * Backend: DELETE /api/VaccinationRecord/{id}
   */
  async deleteVaccinationRecord(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockVaccinations.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVaccinations.splice(index, 1);
      }
      return;
    }

    try {
      await apiService.delete(`${this.recordEndpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting vaccination record:', error);
      throw error;
    }
  }
}

export const vaccinationService = new VaccinationService();
export default vaccinationService;
