import { apiService } from '@/modules/shared/services';
import type { Clinic, ClinicService, ClinicVaccine, Veterinarian } from '../types';

// -------------------------------------------------------------------------
// Backend response wrappers
// -------------------------------------------------------------------------
interface BackendList<T> {
  data?: T[] | { items?: T[]; data?: T[] };
  items?: T[];
  success?: boolean;
  message?: string;
}

function extractList<T>(res: unknown): T[] {
  if (!res || typeof res !== 'object') return [];
  const r = res as BackendList<T>;
  if (Array.isArray(r)) return r as unknown as T[];
  if (r.data) {
    if (Array.isArray(r.data)) return r.data as T[];
    const nested = r.data as { items?: T[]; data?: T[] };
    if (Array.isArray(nested.items)) return nested.items;
    if (Array.isArray(nested.data)) return nested.data;
  }
  if (Array.isArray(r.items)) return r.items;
  return [];
}

// -------------------------------------------------------------------------
// Clinic Manager Service
// -------------------------------------------------------------------------
export const clinicManagerService = {
  /**
   * Fetch all clinics (manager sees the one assigned to them).
   */
  async getClinics(): Promise<Clinic[]> {
    const res = await apiService.get<unknown>('/Clinic?pageSize=100&pageNumber=1');
    return extractList<Clinic>(res);
  },

  /**
   * Fetch single clinic by ID.
   */
  async getClinicById(clinicId: string): Promise<Clinic | null> {
    try {
      const res = await apiService.get<unknown>(`/Clinic/${clinicId}`);
      const r = res as { data?: Clinic; success?: boolean };
      return r.data ?? (res as unknown as Clinic);
    } catch {
      return null;
    }
  },

  /**
   * Fetch all veterinarians. Filter by clinicId on frontend.
   */
  async getVeterinarians(clinicId?: string): Promise<Veterinarian[]> {
    const res = await apiService.get<unknown>('/Veterinarian?pageSize=100&pageNumber=1');
    const list = extractList<Veterinarian>(res);
    if (clinicId) {
      return list.filter((v) => v.clinicId === clinicId);
    }
    return list;
  },

  /**
   * Fetch services for a specific clinic.
   */
  async getServicesByClinic(clinicId: string): Promise<ClinicService[]> {
    const res = await apiService.get<unknown>(`/ClinicService/by-clinic/${clinicId}`);
    return extractList<ClinicService>(res);
  },

  /**
   * Fetch vaccines for a specific clinic.
   */
  async getVaccinesByClinic(clinicId: string): Promise<ClinicVaccine[]> {
    // Get all clinic vaccines then filter by clinicId (backend doesn't have by-clinic for vaccine)
    const res = await apiService.get<unknown>('/ClinicVaccine?pageSize=100&pageNumber=1');
    const list = extractList<ClinicVaccine>(res);
    return list.filter((v) => v.clinicId === clinicId);
  },

  /**
   * Update clinic's info.
   */
  async updateClinic(
    clinicId: string,
    payload: { name: string; address: string; phone: string; clinicManagerId: string; imageUrl?: string },
  ): Promise<void> {
    await apiService.put(`/Clinic/update/${clinicId}`, payload);
  },

  /**
   * Toggle service availability in a clinic.
   */
  async updateClinicService(serviceId: string, payload: { isAvailable: boolean; price: number }): Promise<void> {
    await apiService.put(`/ClinicService/update/${serviceId}`, payload);
  },

  /**
   * Toggle vaccine availability in a clinic.
   */
  async updateClinicVaccine(vaccineId: string, payload: { isAvailable: boolean; price: number }): Promise<void> {
    await apiService.put(`/ClinicVaccine/update/${vaccineId}`, payload);
  },
};
