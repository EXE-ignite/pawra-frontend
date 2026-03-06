import { apiService } from '@/modules/shared/services';

/**
 * Clinic Service
 *
 * Backend endpoints:
 * - GET /api/Clinic              - Get all clinics (paginated)
 * - GET /api/Clinic/{id}         - Get clinic by ID
 * - GET /api/Clinic/search       - Search clinics by name
 * - GET /api/Clinic/search-by-service - Search clinics by service name
 */

export interface ClinicDto {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  clinicManagerId?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class ClinicService {
  private readonly endpoint = '/Clinic';

  /**
   * Get all clinics (paginated)
   * Backend: GET /api/Clinic?pageSize=100&pageNumber=1
   */
  async getAllClinics(pageSize = 100, pageNumber = 1): Promise<ClinicDto[]> {
    const response = await apiService.get<ClinicDto[] | PaginatedResponse<ClinicDto>>(
      `${this.endpoint}?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<ClinicDto>)?.items || [];
  }

  /**
   * Get clinic by ID
   * Backend: GET /api/Clinic/{id}
   */
  async getClinicById(id: string): Promise<ClinicDto> {
    const response = await apiService.get<ClinicDto>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Search clinics by name
   * Backend: GET /api/Clinic/search?name=...
   */
  async searchByName(name: string): Promise<ClinicDto[]> {
    const response = await apiService.get<ClinicDto[]>(
      `${this.endpoint}/search?name=${encodeURIComponent(name)}`
    );
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Search clinics by service
   * Backend: GET /api/Clinic/search-by-service?serviceName=...
   */
  async searchByService(serviceName: string): Promise<ClinicDto[]> {
    const response = await apiService.get<ClinicDto[]>(
      `${this.endpoint}/search-by-service?serviceName=${encodeURIComponent(serviceName)}`
    );
    return Array.isArray(response.data) ? response.data : [];
  }
}

export const clinicService = new ClinicService();
export default clinicService;
