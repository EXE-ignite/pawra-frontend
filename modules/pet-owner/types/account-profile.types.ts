export interface AccountProfile {
  accountId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  customerId?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
  systemUpdates: boolean;
}

export type ProfileTab = 'basic-info' | 'change-password' | 'notifications';
