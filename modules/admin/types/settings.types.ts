// ---------------------------------------------------------------------------
// Settings Types for Admin Management
// ---------------------------------------------------------------------------

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultCurrency: string;
  defaultLanguage: string;
  timezone: string;
}

export interface SubscriptionSettings {
  trialDays: number;
  allowTrialExtension: boolean;
  autoRenewDefault: boolean;
  gracePeriodDays: number;
  reminderDaysBefore: number;
  maxPetsBasic: number;
  maxPetsPremium: number;
  maxPetsVip: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  subscriptionReminder: boolean;
  appointmentReminder: boolean;
  vaccinationReminder: boolean;
  medicationReminder: boolean;
}

export interface AppSettings {
  system: SystemSettings;
  subscription: SubscriptionSettings;
  notifications: NotificationSettings;
}

export interface UpdateSettingsPayload {
  system?: Partial<SystemSettings>;
  subscription?: Partial<SubscriptionSettings>;
  notifications?: Partial<NotificationSettings>;
}
