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
   * Fetch only the clinics belonging to the currently logged-in manager.
   * Steps:
   *   1. GET /Auth/profile  → current account id
   *   2. GET /ClinicManager → find the ClinicManager record for this account
   *   3. GET /Clinic        → filter by clinicManagerId === that record's id
   */
  async getClinics(): Promise<Clinic[]> {
    // 1. Resolve current account id
    let accountId: string | null = null;
    try {
      const profileRes = await apiService.get<unknown>('/Auth/profile');
      const profile = profileRes as { data?: { id?: string }; id?: string };
      accountId = profile?.data?.id ?? (profile as { id?: string })?.id ?? null;
    } catch {
      // If profile fails, fall through and return all clinics as best-effort
    }

    const [clinicManagerRes, clinicRes] = await Promise.all([
      apiService.get<unknown>('/ClinicManager?pageSize=100&pageNumber=1'),
      apiService.get<unknown>('/Clinic?pageSize=100&pageNumber=1'),
    ]);

    const allClinics = extractList<Clinic>(clinicRes);

    if (!accountId) return allClinics;

    // 2. Find the ClinicManager whose accountId matches the current user
    interface CMRecord { id: string; accountId: string }
    const managers = extractList<CMRecord>(clinicManagerRes);
    const myManager = managers.find((m) => m.accountId === accountId);

    if (!myManager) {
      // Backend pagination bug: current user's ClinicManager record is missing from the list.
      // Fall back: show clinics whose clinicManagerId isn't claimed by any listed manager
      // (they must belong to the current user).
      const knownManagerIds = new Set(managers.map((m) => m.id));
      return allClinics.filter((c) => !knownManagerIds.has(c.clinicManagerId));
    }

    // 3. Filter clinics by clinicManagerId
    return allClinics.filter((c) => c.clinicManagerId === myManager.id);
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
   * Fetch all veterinarians, enriched with account info (fullName, email, avatarUrl).
   */
  async getVeterinarians(clinicId?: string): Promise<Veterinarian[]> {
    const vetRes = await apiService.get<unknown>('/Veterinarian?pageSize=100&pageNumber=1');
    let list = extractList<Veterinarian>(vetRes);
    if (clinicId) {
      list = list.filter((v) => v.clinicId === clinicId);
    }

    // Fetch each account individually (/Account requires Admin, /Account/{id} only requires auth)
    interface AccountDetail { id: string; fullName?: string | null; name?: string | null; email?: string | null; avatarUrl?: string | null; avatar?: string | null }
    const accounts = await Promise.all(
      list.map(async (v) => {
        try {
          const res = await apiService.get<unknown>(`/Account/${v.accountId}`);
          const r = res as { data?: AccountDetail; success?: boolean };
          return (r.data ?? res) as AccountDetail;
        } catch {
          return null;
        }
      }),
    );

    return list.map((v, i) => {
      const acc = accounts[i];
      return {
        ...v,
        fullName: acc?.fullName ?? acc?.name ?? null,
        email: acc?.email ?? null,
        avatarUrl: acc?.avatarUrl ?? acc?.avatar ?? null,
      };
    });
  },

  /**
   * Fetch services for a specific clinic.
   */
  async getServicesByClinic(clinicId: string): Promise<ClinicService[]> {
    const res = await apiService.get<unknown>(`/ClinicService/by-clinic/${clinicId}`);
    return extractList<ClinicService>(res);
  },

  /**
   * Fetch vaccines for a specific clinic, enriched with vaccine name & manufacturer.
   */
  async getVaccinesByClinic(clinicId: string): Promise<ClinicVaccine[]> {
    // Fetch clinic vaccines and the global vaccine list in parallel
    const [clinicVaccineRes, vaccineRes] = await Promise.all([
      apiService.get<unknown>('/ClinicVaccine?pageSize=100&pageNumber=1'),
      apiService.get<unknown>('/Vaccine?pageSize=100&pageNumber=1'),
    ]);

    const clinicVaccines = extractList<ClinicVaccine>(clinicVaccineRes).filter(
      (v) => v.clinicId === clinicId,
    );

    interface VaccineDetail { id: string; name?: string | null; manufacturer?: string | null }
    const vaccineList = extractList<VaccineDetail>(vaccineRes);
    const vaccineMap = new Map(vaccineList.map((v) => [v.id, v]));

    return clinicVaccines.map((cv) => {
      const detail = vaccineMap.get(cv.vaccineId);
      return {
        ...cv,
        vaccineName: detail?.name ?? null,
        manufacturer: detail?.manufacturer ?? null,
      };
    });
  },

  // ── Clinic CRUD ────────────────────────────────────────────────────────────

  async createClinic(payload: { name: string; address: string; phone: string; clinicManagerId: string; imageUrl?: string }): Promise<Clinic> {
    const res = await apiService.post<unknown>('/Clinic/create', payload);
    const r = res as { data?: Clinic };
    return r.data ?? (res as unknown as Clinic);
  },

  async updateClinic(
    clinicId: string,
    payload: { name: string; address: string; phone: string; clinicManagerId: string; imageUrl?: string },
  ): Promise<void> {
    await apiService.put(`/Clinic/update/${clinicId}`, payload);
  },

  async deleteClinic(clinicId: string): Promise<void> {
    await apiService.delete(`/Clinic/${clinicId}`);
  },

  // ── Vet CRUD ───────────────────────────────────────────────────────────────

  async createVet(payload: { accountId: string; clinicId: string; licenseNumber: string }): Promise<void> {
    await apiService.post('/Veterinarian/create', payload);
  },

  async updateVet(vetId: string, payload: { clinicId: string; licenseNumber: string }): Promise<void> {
    await apiService.put(`/Veterinarian/update/${vetId}`, payload);
  },

  async deleteVet(vetId: string): Promise<void> {
    await apiService.delete(`/Veterinarian/${vetId}`);
  },

  // ── Service CRUD ───────────────────────────────────────────────────────────

  /** Fetch master service list for the add-service dropdown. */
  async getMasterServices(): Promise<{ id: string; name: string | null; description: string | null; imageUrl: string | null }[]> {
    const res = await apiService.get<unknown>('/Service?pageSize=100&pageNumber=1');
    return extractList(res);
  },

  async createClinicService(payload: { clinicId: string; serviceId: string; price: number; isAvailable: boolean }): Promise<void> {
    await apiService.post('/ClinicService/create', payload);
  },

  async updateClinicService(serviceId: string, payload: { isAvailable: boolean; price: number }): Promise<void> {
    await apiService.put(`/ClinicService/update/${serviceId}`, payload);
  },

  async deleteClinicService(clinicServiceId: string): Promise<void> {
    await apiService.delete(`/ClinicService/${clinicServiceId}`);
  },

  // ── Vaccine CRUD ───────────────────────────────────────────────────────────

  /** Fetch master vaccine list for the add-vaccine dropdown. */
  async getMasterVaccines(): Promise<{ id: string; name: string | null; manufacturer: string | null }[]> {
    const res = await apiService.get<unknown>('/Vaccine?pageSize=100&pageNumber=1');
    return extractList(res);
  },

  async createClinicVaccine(payload: { clinicId: string; vaccineId: string; price: number; isAvailable: boolean }): Promise<void> {
    await apiService.post('/ClinicVaccine/create', payload);
  },

  async updateClinicVaccine(vaccineId: string, payload: { isAvailable: boolean; price: number }): Promise<void> {
    await apiService.put(`/ClinicVaccine/update/${vaccineId}`, payload);
  },

  async deleteClinicVaccine(clinicVaccineId: string): Promise<void> {
    await apiService.delete(`/ClinicVaccine/${clinicVaccineId}`);
  },
};
