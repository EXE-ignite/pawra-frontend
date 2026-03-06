import { apiService } from '@/modules/shared/services';

/**
 * Medication Service
 *
 * Backend endpoints:
 * - GET    /api/medication                    - Get all medications (Admin)
 * - GET    /api/medication/{id}               - Get medication by ID (with logs)
 * - GET    /api/medication/pet/{petId}        - Get pet medications
 * - POST   /api/medication/create             - Create medication
 * - PUT    /api/medication/update/{id}        - Update medication
 * - DELETE /api/medication/{id}               - Soft delete medication (204)
 * - GET    /api/medication/{medicationId}/logs - Get medication logs
 * - POST   /api/medication/logs/add           - Add medication log
 */

export type MedicationUnit = 'mg' | 'ml' | 'tablets' | 'drops' | 'other';
export type MedicationFrequency =
  | 'Once'
  | 'Daily'
  | 'TwiceDaily'
  | 'Weekly'
  | 'BiWeekly'
  | 'Monthly'
  | 'AsNeeded';
export type MedicationStatus = 'Active' | 'Completed' | 'Paused' | 'Discontinued';
export type MedicationLogStatus = 'Given' | 'Missed' | 'Skipped';

export interface MedicationLogDto {
  id: string;
  medicationId: string;
  administeredDate: string; // YYYY-MM-DD
  administeredTime?: string; // HH:mm:ss
  status?: MedicationLogStatus;
  notes?: string;
  createdDate: string;
}

export interface MedicationDto {
  id: string;
  petId: string;
  petName?: string;
  medicationName: string;
  dosage: number;
  unit: MedicationUnit;
  frequency: MedicationFrequency;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  notes?: string;
  status?: MedicationStatus;
  createdDate: string;
  updatedDate?: string;
  medicationLogs?: MedicationLogDto[];
}

export interface CreateMedicationDto {
  petId: string;
  medicationName: string;         // max 255
  dosage: number;                  // 0.001 – 99999.999
  unit: MedicationUnit;
  frequency: MedicationFrequency;
  startDate: string;               // YYYY-MM-DD
  endDate?: string;
  notes?: string;                  // max 1000
  status?: MedicationStatus;
}

export interface UpdateMedicationDto {
  medicationName: string;
  dosage: number;
  unit: MedicationUnit;
  frequency: MedicationFrequency;
  startDate: string;
  endDate?: string;
  notes?: string;
  status: MedicationStatus;        // required on update
}

export interface CreateMedicationLogDto {
  medicationId: string;
  administeredDate: string;        // YYYY-MM-DD
  administeredTime?: string;       // HH:mm:ss
  status: MedicationLogStatus;
  notes?: string;                  // max 500
}

class MedicationService {
  private readonly endpoint = '/medication';

  /**
   * Get all medications – Admin only
   * Backend: GET /api/medication
   */
  async getAll(): Promise<MedicationDto[]> {
    const response = await apiService.get<MedicationDto[]>(this.endpoint);
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Get medication by ID (includes logs)
   * Backend: GET /api/medication/{id}
   */
  async getById(id: string): Promise<MedicationDto> {
    const response = await apiService.get<MedicationDto>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Get all medications for a pet
   * Backend: GET /api/medication/pet/{petId}
   */
  async getByPet(petId: string): Promise<MedicationDto[]> {
    const response = await apiService.get<MedicationDto[]>(`${this.endpoint}/pet/${petId}`);
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Create a medication
   * Backend: POST /api/medication/create
   */
  async create(data: CreateMedicationDto): Promise<MedicationDto> {
    const response = await apiService.post<MedicationDto>(`${this.endpoint}/create`, data);
    return response.data;
  }

  /**
   * Update a medication
   * Backend: PUT /api/medication/update/{id}
   */
  async update(id: string, data: UpdateMedicationDto): Promise<MedicationDto> {
    const response = await apiService.put<MedicationDto>(`${this.endpoint}/update/${id}`, data);
    return response.data;
  }

  /**
   * Soft-delete a medication
   * Backend: DELETE /api/medication/{id}  →  204 No Content
   */
  async delete(id: string): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Get logs for a medication
   * Backend: GET /api/medication/{medicationId}/logs
   */
  async getLogs(medicationId: string): Promise<MedicationLogDto[]> {
    const response = await apiService.get<MedicationLogDto[]>(
      `${this.endpoint}/${medicationId}/logs`
    );
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Add a log entry for a medication
   * Backend: POST /api/medication/logs/add
   */
  async addLog(data: CreateMedicationLogDto): Promise<MedicationLogDto> {
    const response = await apiService.post<MedicationLogDto>(`${this.endpoint}/logs/add`, data);
    return response.data;
  }
}

export const medicationService = new MedicationService();
export default medicationService;
