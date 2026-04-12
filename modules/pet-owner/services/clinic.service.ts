import { apiService } from '@/modules/shared/services';

/**
 * Clinic Service
 *
 * Backend endpoints:
 * - GET /api/Clinic              - Get all clinics (paginated)
 * - GET /api/Clinic/{id}         - Get clinic by ID
 * - GET /api/Clinic/search       - Search clinics by name
 * - GET /api/Clinic/search-by-service - Search clinics by service name
 * - GET /api/ClinicService/by-clinic/{clinicId} - Get services by clinic
 * - GET /api/Veterinarian        - Get all veterinarians
 */

export interface ClinicDto {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  clinicManagerId?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface ClinicServiceDto {
  id: string;
  clinicId: string;
  serviceId: string;
  serviceName?: string;
  serviceDescription?: string;
  serviceImageUrl?: string;
  price: number;
  isAvailable: boolean;
}

export interface VeterinarianDto {
  id: string;
  accountId: string;
  clinicId: string;
  licenseNumber?: string;
  fullName?: string;
  account?: {
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
}

export interface ServiceDto {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
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
   * Get all catalog services
   * Backend: GET /api/Service?pageSize=100&pageNumber=1
   */
  async getAllServices(): Promise<ServiceDto[]> {
    try {
      const response = await apiService.get<ServiceDto[] | PaginatedResponse<ServiceDto> | { data?: ServiceDto[] }>(
        `/Service?pageSize=100&pageNumber=1`
      );
      if (Array.isArray(response.data)) return response.data;
      const paged = (response.data as PaginatedResponse<ServiceDto>)?.items;
      if (Array.isArray(paged)) return paged;
      const inner = (response.data as { data?: ServiceDto[] })?.data;
      return Array.isArray(inner) ? inner : [];
    } catch {
      return [];
    }
  }

  /**
   * Search clinics by service
   * Backend: GET /api/Clinic/search-by-service?serviceName=...
   */
  async searchByService(serviceName: string): Promise<ClinicDto[]> {
    try {
      const response = await apiService.get<ClinicDto[] | { data?: ClinicDto[] }>(
        `${this.endpoint}/search-by-service?serviceName=${encodeURIComponent(serviceName)}`
      );
      if (Array.isArray(response.data)) return response.data;
      const inner = (response.data as { data?: ClinicDto[] })?.data;
      return Array.isArray(inner) ? inner : [];
    } catch {
      return [];
    }
  }

  /**
   * Get clinic services
   * Backend: GET /api/ClinicService/by-clinic/{clinicId}
   */
  async getServicesByClinic(clinicId: string): Promise<ClinicServiceDto[]> {
    const response = await apiService.get<ClinicServiceDto[] | { data?: ClinicServiceDto[] }>(
      `/ClinicService/by-clinic/${clinicId}`
    );
    if (Array.isArray(response.data)) return response.data;
    const inner = (response.data as { data?: ClinicServiceDto[] })?.data;
    return Array.isArray(inner) ? inner : [];
  }

  /**
   * Get all veterinarians
   * Backend: GET /api/Veterinarian?pageSize=100&pageNumber=1
   */
  async getAllVeterinarians(pageSize = 100, pageNumber = 1): Promise<VeterinarianDto[]> {
    const response = await apiService.get<VeterinarianDto[] | PaginatedResponse<VeterinarianDto>>(
      `/Veterinarian?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<VeterinarianDto>)?.items || [];
  }

  /**
   * Get veterinarians by clinic (filter client-side)
   * NOTE: GET /Veterinarian may be restricted to admin role — returns [] on 403
   */
  async getVeterinariansByClinic(clinicId: string): Promise<VeterinarianDto[]> {
    try {
      const all = await this.getAllVeterinarians();
      return all.filter(v => v.clinicId === clinicId);
    } catch {
      // 403 Forbidden — endpoint not accessible for pet owner role
      return [];
    }
  }
}

export const clinicService = new ClinicService();
export default clinicService;
