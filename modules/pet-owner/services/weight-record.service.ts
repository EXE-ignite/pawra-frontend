import { apiService } from '@/modules/shared/services';

/**
 * Weight Record Service
 *
 * Backend endpoints:
 * - GET    /api/weight-record/pet/{petId}          - Get records by pet (sorted asc)
 * - GET    /api/weight-record/{id}                 - Get record by ID
 * - GET    /api/weight-record/pet/{petId}/chart    - Get growth chart data
 * - POST   /api/weight-record/create               - Create weight record
 * - PUT    /api/weight-record/update/{id}          - Update weight record
 * - DELETE /api/weight-record/{id}                 - Soft delete (204)
 */

export type WeightUnit = 'kg' | 'lbs';
export type WeightSource = 'Owner' | 'Vet' | 'Clinic';

export interface WeightRecordDto {
  id: string;
  petId: string;
  petName?: string;
  weight: number;
  unit?: WeightUnit;
  recordedDate: string; // YYYY-MM-DD
  source?: WeightSource;
  notes?: string;
  createdDate: string;
  updatedDate?: string;
}

export interface WeightDataPointDto {
  id: string;
  recordedDate: string; // YYYY-MM-DD
  weight: number;
  source?: WeightSource;
  notes?: string;
}

export interface WeightGrowthChartDto {
  petId: string;
  petName?: string;
  species?: string;
  unit?: WeightUnit;
  currentWeight?: number;
  minWeight?: number;
  maxWeight?: number;
  dataPoints?: WeightDataPointDto[];
}

export interface CreateWeightRecordDto {
  petId: string;
  weight: number;       // 0.01 – 9999.99
  unit: WeightUnit;
  recordedDate: string; // YYYY-MM-DD
  source: WeightSource;
  notes?: string;       // max 500
}

export interface UpdateWeightRecordDto {
  weight: number;
  unit: WeightUnit;
  recordedDate: string;
  source: WeightSource;
  notes?: string;
}

class WeightRecordService {
  private readonly endpoint = '/weight-record';

  /**
   * Get all weight records for a pet (sorted ascending by date)
   * Backend: GET /api/weight-record/pet/{petId}
   */
  async getByPet(petId: string): Promise<WeightRecordDto[]> {
    const response = await apiService.get<WeightRecordDto[]>(`${this.endpoint}/pet/${petId}`);
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Get a single weight record by ID
   * Backend: GET /api/weight-record/{id}
   */
  async getById(id: string): Promise<WeightRecordDto> {
    const response = await apiService.get<WeightRecordDto>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Get growth chart data for a pet
   * Backend: GET /api/weight-record/pet/{petId}/chart?from=YYYY-MM-DD&to=YYYY-MM-DD
   */
  async getGrowthChart(petId: string, from?: string, to?: string): Promise<WeightGrowthChartDto> {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiService.get<WeightGrowthChartDto>(
      `${this.endpoint}/pet/${petId}/chart${query}`
    );
    return response.data;
  }

  /**
   * Create a weight record
   * Backend: POST /api/weight-record/create
   */
  async create(data: CreateWeightRecordDto): Promise<WeightRecordDto> {
    const response = await apiService.post<WeightRecordDto>(`${this.endpoint}/create`, data);
    return response.data;
  }

  /**
   * Update a weight record
   * Backend: PUT /api/weight-record/update/{id}
   */
  async update(id: string, data: UpdateWeightRecordDto): Promise<WeightRecordDto> {
    const response = await apiService.put<WeightRecordDto>(`${this.endpoint}/update/${id}`, data);
    return response.data;
  }

  /**
   * Get growth chart data mapped to WeightRecord[] shape ({ date, weight })
   * for use with the GrowthChart component.
   */
  async getWeightHistory(petId: string, from?: string, to?: string): Promise<{ date: string; weight: number }[]> {
    const chart = await this.getGrowthChart(petId, from, to);
    return (chart.dataPoints ?? []).map((p) => ({ date: p.recordedDate, weight: p.weight }));
  }

  /**
   * Soft-delete a weight record
   * Backend: DELETE /api/weight-record/{id}  →  204 No Content
   */
  async delete(id: string): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`);
  }
}

export const weightRecordService = new WeightRecordService();
export default weightRecordService;
