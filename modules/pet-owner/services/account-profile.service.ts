import { apiService } from '@/modules/shared/services/api';
import type {
  AccountProfile,
  UpdateProfileRequest,
  NotificationPreferences,
} from '../types/account-profile.types';

const NOTIF_STORAGE_KEY = 'pawra_notification_prefs';

// Shape returned by GET /api/Auth/profile
interface BackendProfile {
  id?: string;
  accountId?: string;
  email: string;
  fullName?: string;
  name?: string;
  avatarUrl?: string;
  avatar?: string;
  phone?: string;
  customerId?: string;
  customer?: { id?: string; phone?: string };
}

function mapProfile(data: BackendProfile): AccountProfile {
  return {
    accountId: data.id ?? data.accountId ?? '',
    email: data.email,
    fullName: data.fullName ?? data.name ?? '',
    avatarUrl: data.avatarUrl ?? data.avatar,
    phone: data.phone ?? data.customer?.phone,
    customerId: data.customerId ?? data.customer?.id,
  };
}

export async function getProfile(): Promise<AccountProfile> {
  const response = await apiService.get<BackendProfile>('/Auth/profile');
  const data: BackendProfile = (response as any).data ?? response;
  return mapProfile(data);
}

export async function updateProfile(
  current: AccountProfile,
  updates: UpdateProfileRequest
): Promise<AccountProfile> {
  if (!current.accountId) throw new Error('Account ID không xác định');

  // Update fullName via Account endpoint
  await apiService.put(`/Account/${current.accountId}`, {
    fullName: updates.fullName,
  });

  // Update phone via Customer endpoint if customerId is available
  if (updates.phone !== undefined && current.customerId) {
    await apiService.put(`/Customer/update/${current.customerId}`, {
      phone: updates.phone,
    });
  }

  return { ...current, ...updates };
}

// ── Notification preferences (localStorage only — no backend endpoint) ──────

const DEFAULT_PREFS: NotificationPreferences = {
  appointmentReminders: true,
  vaccinationAlerts: true,
  medicationReminders: true,
  promotionalEmails: false,
};

export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(prefs));
}

// ── Customer endpoints ───────────────────────────────────────────────────────

export interface CustomerDto {
  id: string;
  accountId: string;
  phone?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface CreateCustomerDto {
  accountId: string;
  phone?: string;
}

export async function createCustomer(data: CreateCustomerDto): Promise<CustomerDto> {
  const response = await apiService.post<CustomerDto>('/Customer/create', data);
  return (response as any).data ?? response;
}

export async function getCustomerById(customerId: string): Promise<CustomerDto> {
  const response = await apiService.get<CustomerDto>(`/Customer/${customerId}`);
  return (response as any).data ?? response;
}
