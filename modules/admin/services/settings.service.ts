import type {
  AppSettings,
  SystemSettings,
  SubscriptionSettings,
  NotificationSettings,
  UpdateSettingsPayload,
} from '../types/settings.types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_SETTINGS: AppSettings = {
  system: {
    siteName: 'Pawra',
    siteDescription: 'He thong quan ly suc khoe thu cung',
    supportEmail: 'support@pawra.vn',
    supportPhone: '1900-1234',
    maintenanceMode: false,
    allowRegistration: true,
    defaultCurrency: 'VND',
    defaultLanguage: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
  },
  subscription: {
    trialDays: 14,
    allowTrialExtension: false,
    autoRenewDefault: true,
    gracePeriodDays: 3,
    reminderDaysBefore: 7,
    maxPetsBasic: 1,
    maxPetsPremium: 5,
    maxPetsVip: -1, // -1 = unlimited
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    subscriptionReminder: true,
    appointmentReminder: true,
    vaccinationReminder: true,
    medicationReminder: true,
  },
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
class SettingsAdminService {
  private settings: AppSettings = { ...MOCK_SETTINGS };

  async getSettings(): Promise<AppSettings> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return { ...this.settings };
    }

    // TODO: Implement real API call when backend supports settings endpoint
    // const response = await apiService.get<AppSettings>('/Settings');
    // return response.data;
    
    await new Promise((r) => setTimeout(r, 300));
    return { ...this.settings };
  }

  async updateSystemSettings(payload: Partial<SystemSettings>): Promise<SystemSettings> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      this.settings.system = { ...this.settings.system, ...payload };
      return { ...this.settings.system };
    }

    // TODO: Implement real API call
    // const response = await apiService.put<SystemSettings>('/Settings/system', payload);
    // return response.data;
    
    await new Promise((r) => setTimeout(r, 300));
    this.settings.system = { ...this.settings.system, ...payload };
    return { ...this.settings.system };
  }

  async updateSubscriptionSettings(payload: Partial<SubscriptionSettings>): Promise<SubscriptionSettings> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      this.settings.subscription = { ...this.settings.subscription, ...payload };
      return { ...this.settings.subscription };
    }

    // TODO: Implement real API call
    await new Promise((r) => setTimeout(r, 300));
    this.settings.subscription = { ...this.settings.subscription, ...payload };
    return { ...this.settings.subscription };
  }

  async updateNotificationSettings(payload: Partial<NotificationSettings>): Promise<NotificationSettings> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      this.settings.notifications = { ...this.settings.notifications, ...payload };
      return { ...this.settings.notifications };
    }

    // TODO: Implement real API call
    await new Promise((r) => setTimeout(r, 300));
    this.settings.notifications = { ...this.settings.notifications, ...payload };
    return { ...this.settings.notifications };
  }

  async updateSettings(payload: UpdateSettingsPayload): Promise<AppSettings> {
    if (payload.system) {
      await this.updateSystemSettings(payload.system);
    }
    if (payload.subscription) {
      await this.updateSubscriptionSettings(payload.subscription);
    }
    if (payload.notifications) {
      await this.updateNotificationSettings(payload.notifications);
    }
    return { ...this.settings };
  }
}

export const settingsAdminService = new SettingsAdminService();
