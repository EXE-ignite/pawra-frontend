import { apiService } from '@/modules/shared/services/api';
import type {
  AccountProfile,
  UpdateProfileRequest,
  NotificationPreferences,
  ChangePasswordRequest,
} from '../types/account-profile.types';

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

export async function updateAvatar(
  current: AccountProfile,
  avatarUrl: string
): Promise<AccountProfile> {
  if (!current.accountId) throw new Error('Account ID không xác định');

  await apiService.put(`/Account/${current.accountId}`, {
    fullName: current.fullName,
    avatarUrl,
  });

  return { ...current, avatarUrl };
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await apiService.put('/Auth/change-password', data);
}

// ── Notification preferences (real API) ─────────────────────────────────────

const DEFAULT_PREFS: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  appointmentReminders: true,
  marketingEmails: false,
  systemUpdates: true,
};

export async function getNotificationPreferences(accountId: string): Promise<NotificationPreferences> {
  const response = await apiService.get<NotificationPreferences>(`/Account/${accountId}/notifications`);
  const data = (response as any).data ?? response;
  return { ...DEFAULT_PREFS, ...data };
}

export async function saveNotificationPreferences(
  accountId: string,
  prefs: NotificationPreferences
): Promise<void> {
  await apiService.put(`/Account/${accountId}/notifications`, prefs);
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
