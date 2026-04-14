// ============================================================
// Clinic Manager Types — mirrors backend OpenAPI schemas
// ============================================================

export interface Clinic {
  id: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  imageUrl: string | null;
  clinicManagerId: string;
  createdDate: string;
  updatedDate: string | null;
}

export interface ClinicService {
  id: string;
  clinicId: string;
  serviceId: string;
  serviceName: string | null;
  serviceDescription: string | null;
  serviceImageUrl: string | null;
  isAvailable: boolean;
  price: number;
  createdDate: string;
  updatedDate: string | null;
}

export interface ClinicVaccine {
  id: string;
  clinicId: string;
  vaccineId: string;
  isAvailable: boolean;
  price: number;
  createdDate: string;
  updatedDate: string | null;
  // enriched on frontend
  vaccineName?: string | null;
  manufacturer?: string | null;
}

export interface Veterinarian {
  id: string;
  accountId: string;
  clinicId: string;
  licenseNumber: string | null;
  createdDate: string;
  updatedDate: string | null;
  // enriched on frontend
  fullName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface ClinicStats {
  totalVets: number;
  totalServices: number;
  totalVaccines: number;
}

export type ClinicManagerTab = 'overview' | 'vets' | 'services' | 'vaccines';
