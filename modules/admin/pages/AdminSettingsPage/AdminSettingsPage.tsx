'use client';

import { useState, useEffect } from 'react';
import { settingsAdminService } from '../../services/settings.service';
import type {
  AppSettings,
  SystemSettings,
  SubscriptionSettings,
  NotificationSettings,
} from '../../types/settings.types';
import styles from './AdminSettingsPage.module.scss';

type TabKey = 'system' | 'subscription' | 'notifications';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'system', label: 'He thong', icon: '⚙️' },
  { key: 'subscription', label: 'Subscription', icon: '💳' },
  { key: 'notifications', label: 'Thong bao', icon: '🔔' },
];

const CURRENCIES = [
  { value: 'VND', label: 'VND - Viet Nam Dong' },
  { value: 'USD', label: 'USD - US Dollar' },
];

const LANGUAGES = [
  { value: 'vi', label: 'Tieng Viet' },
  { value: 'en', label: 'English' },
];

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (GMT+7)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (GMT+8)' },
];

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('system');

  // Local state for form
  const [systemForm, setSystemForm] = useState<SystemSettings | null>(null);
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionSettings | null>(null);
  const [notificationForm, setNotificationForm] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsAdminService.getSettings();
      setSettings(data);
      setSystemForm(data.system);
      setSubscriptionForm(data.subscription);
      setNotificationForm(data.notifications);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Khong the tai cai dat. Vui long thu lai.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystem = async () => {
    if (!systemForm) return;
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);
      await settingsAdminService.updateSystemSettings(systemForm);
      setSuccessMsg('Da luu cai dat he thong!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSubscription = async () => {
    if (!subscriptionForm) return;
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);
      await settingsAdminService.updateSubscriptionSettings(subscriptionForm);
      setSuccessMsg('Da luu cai dat subscription!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!notificationForm) return;
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);
      await settingsAdminService.updateNotificationSettings(notificationForm);
      setSuccessMsg('Da luu cai dat thong bao!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const renderSystemSettings = () => {
    if (!systemForm) return null;
    return (
      <div className={styles.settingsSection}>
        <h3 className={styles.sectionTitle}>Cai dat he thong</h3>
        <p className={styles.sectionDesc}>Cau hinh chung cho toan bo he thong</p>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Ten trang web</label>
            <input
              type="text"
              className={styles.input}
              value={systemForm.siteName}
              onChange={(e) => setSystemForm({ ...systemForm, siteName: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email ho tro</label>
            <input
              type="email"
              className={styles.input}
              value={systemForm.supportEmail}
              onChange={(e) => setSystemForm({ ...systemForm, supportEmail: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>So dien thoai ho tro</label>
            <input
              type="text"
              className={styles.input}
              value={systemForm.supportPhone}
              onChange={(e) => setSystemForm({ ...systemForm, supportPhone: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tien te mac dinh</label>
            <select
              className={styles.select}
              value={systemForm.defaultCurrency}
              onChange={(e) => setSystemForm({ ...systemForm, defaultCurrency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ngon ngu mac dinh</label>
            <select
              className={styles.select}
              value={systemForm.defaultLanguage}
              onChange={(e) => setSystemForm({ ...systemForm, defaultLanguage: e.target.value })}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mui gio</label>
            <select
              className={styles.select}
              value={systemForm.timezone}
              onChange={(e) => setSystemForm({ ...systemForm, timezone: e.target.value })}
            >
              {TIMEZONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>Mo ta trang web</label>
            <textarea
              className={styles.textarea}
              value={systemForm.siteDescription}
              onChange={(e) => setSystemForm({ ...systemForm, siteDescription: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        <div className={styles.togglesSection}>
          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Che do bao tri</span>
              <span className={styles.toggleDesc}>Tat tat ca truy cap nguoi dung, chi admin co the truy cap</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={systemForm.maintenanceMode}
                onChange={(e) => setSystemForm({ ...systemForm, maintenanceMode: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Cho phep dang ky</span>
              <span className={styles.toggleDesc}>Nguoi dung moi co the tao tai khoan</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={systemForm.allowRegistration}
                onChange={(e) => setSystemForm({ ...systemForm, allowRegistration: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSaveSystem} disabled={saving}>
            {saving ? 'Dang luu...' : 'Luu cai dat'}
          </button>
        </div>
      </div>
    );
  };

  const renderSubscriptionSettings = () => {
    if (!subscriptionForm) return null;
    return (
      <div className={styles.settingsSection}>
        <h3 className={styles.sectionTitle}>Cai dat Subscription</h3>
        <p className={styles.sectionDesc}>Cau hinh cac thong so lien quan den goi dang ky</p>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>So ngay dung thu</label>
            <input
              type="number"
              className={styles.input}
              value={subscriptionForm.trialDays}
              onChange={(e) => setSubscriptionForm({ ...subscriptionForm, trialDays: Number(e.target.value) })}
              min={0}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>So ngay gia han</label>
            <input
              type="number"
              className={styles.input}
              value={subscriptionForm.gracePeriodDays}
              onChange={(e) => setSubscriptionForm({ ...subscriptionForm, gracePeriodDays: Number(e.target.value) })}
              min={0}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nhac nho truoc (ngay)</label>
            <input
              type="number"
              className={styles.input}
              value={subscriptionForm.reminderDaysBefore}
              onChange={(e) => setSubscriptionForm({ ...subscriptionForm, reminderDaysBefore: Number(e.target.value) })}
              min={1}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Max thu cung (Basic)</label>
            <input
              type="number"
              className={styles.input}
              value={subscriptionForm.maxPetsBasic}
              onChange={(e) => setSubscriptionForm({ ...subscriptionForm, maxPetsBasic: Number(e.target.value) })}
              min={1}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Max thu cung (Premium)</label>
            <input
              type="number"
              className={styles.input}
              value={subscriptionForm.maxPetsPremium}
              onChange={(e) => setSubscriptionForm({ ...subscriptionForm, maxPetsPremium: Number(e.target.value) })}
              min={1}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Max thu cung (VIP)</label>
            <input
              type="number"
              className={styles.input}
              value={subscriptionForm.maxPetsVip}
              onChange={(e) => setSubscriptionForm({ ...subscriptionForm, maxPetsVip: Number(e.target.value) })}
            />
            <span className={styles.fieldHint}>-1 = Khong gioi han</span>
          </div>
        </div>

        <div className={styles.togglesSection}>
          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Cho phep gia han dung thu</span>
              <span className={styles.toggleDesc}>Nguoi dung co the yeu cau them ngay dung thu</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={subscriptionForm.allowTrialExtension}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, allowTrialExtension: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Tu dong gia han mac dinh</span>
              <span className={styles.toggleDesc}>Subscription moi se tu dong bat tu dong gia han</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={subscriptionForm.autoRenewDefault}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, autoRenewDefault: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSaveSubscription} disabled={saving}>
            {saving ? 'Dang luu...' : 'Luu cai dat'}
          </button>
        </div>
      </div>
    );
  };

  const renderNotificationSettings = () => {
    if (!notificationForm) return null;
    return (
      <div className={styles.settingsSection}>
        <h3 className={styles.sectionTitle}>Cai dat thong bao</h3>
        <p className={styles.sectionDesc}>Cau hinh cac kenh va loai thong bao</p>

        <div className={styles.togglesSection}>
          <h4 className={styles.toggleGroupTitle}>Kenh thong bao</h4>
          
          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Email</span>
              <span className={styles.toggleDesc}>Gui thong bao qua email</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notificationForm.emailNotifications}
                onChange={(e) => setNotificationForm({ ...notificationForm, emailNotifications: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>SMS</span>
              <span className={styles.toggleDesc}>Gui thong bao qua tin nhan</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notificationForm.smsNotifications}
                onChange={(e) => setNotificationForm({ ...notificationForm, smsNotifications: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Push notification</span>
              <span className={styles.toggleDesc}>Gui thong bao qua ung dung</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notificationForm.pushNotifications}
                onChange={(e) => setNotificationForm({ ...notificationForm, pushNotifications: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </div>

        <div className={styles.togglesSection}>
          <h4 className={styles.toggleGroupTitle}>Loai thong bao</h4>
          
          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Nhac nho subscription</span>
              <span className={styles.toggleDesc}>Thong bao khi subscription sap het han</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notificationForm.subscriptionReminder}
                onChange={(e) => setNotificationForm({ ...notificationForm, subscriptionReminder: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Nhac nho lich hen</span>
              <span className={styles.toggleDesc}>Thong bao truoc khi co lich hen</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notificationForm.appointmentReminder}
                onChange={(e) => setNotificationForm({ ...notificationForm, appointmentReminder: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Nhac nho tiem phong</span>
              <span className={styles.toggleDesc}>Thong bao khi den han tiem phong</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notificationForm.vaccinationReminder}
                onChange={(e) => setNotificationForm({ ...notificationForm, vaccinationReminder: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Nhac nho uong thuoc</span>
              <span className={styles.toggleDesc}>Thong bao khi den gio uong thuoc</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notificationForm.medicationReminder}
                onChange={(e) => setNotificationForm({ ...notificationForm, medicationReminder: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSaveNotifications} disabled={saving}>
            {saving ? 'Dang luu...' : 'Luu cai dat'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Cai dat</h1>
          <p className={styles.subtitle}>Quan ly cau hinh he thong, subscription va thong bao</p>
        </div>
      </div>

      {successMsg && (
        <div className={styles.successBanner}>
          <span>✓</span> {successMsg}
        </div>
      )}

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Dang tai cai dat...</p>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'system' && renderSystemSettings()}
            {activeTab === 'subscription' && renderSubscriptionSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
          </div>
        </div>
      )}
    </div>
  );
}
