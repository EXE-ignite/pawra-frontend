'use client';

import React, { useState } from 'react';
import { Button } from '@/modules/shared';
import type { NotificationPreferences } from '../../types/account-profile.types';
import styles from './NotificationSettings.module.scss';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onSave: (data: NotificationPreferences) => void;
}

const LABELS: Record<keyof NotificationPreferences, string> = {
  emailNotifications: 'Thông báo qua email',
  pushNotifications: 'Thông báo đẩy',
  smsNotifications: 'Thông báo SMS',
  appointmentReminders: 'Nhắc nhở lịch hẹn',
  marketingEmails: 'Email khuyến mãi',
  systemUpdates: 'Cập nhật hệ thống',
};

const DESCRIPTIONS: Record<keyof NotificationPreferences, string> = {
  emailNotifications: 'Nhận thông báo qua địa chỉ email của bạn',
  pushNotifications: 'Nhận thông báo đẩy trên trình duyệt hoặc thiết bị di động',
  smsNotifications: 'Nhận thông báo qua tin nhắn SMS',
  appointmentReminders: 'Nhận thông báo trước khi có lịch hẹn với bác sĩ thú y',
  marketingEmails: 'Nhận email giới thiệu ưu đãi và tính năng mới',
  systemUpdates: 'Nhận thông báo về cập nhật và bảo trì hệ thống',
};

export function NotificationSettings({ preferences, onSave }: NotificationSettingsProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(preferences);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function handleToggle(key: keyof NotificationPreferences) {
    setPrefs((prev: NotificationPreferences) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      onSave(prefs);
      setSuccessMsg('Đã lưu cài đặt thông báo!');
    } catch {
      setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.list}>
        {(Object.keys(LABELS) as Array<keyof NotificationPreferences>).map((key: keyof NotificationPreferences) => (
          <div key={key} className={styles.item}>
            <div className={styles.info}>
              <span className={styles.itemLabel}>{LABELS[key]}</span>
              <span className={styles.itemDesc}>{DESCRIPTIONS[key]}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[key]}
              onClick={() => handleToggle(key)}
              className={`${styles.toggle} ${prefs[key] ? styles.toggleOn : ''}`}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        ))}
      </div>

      {successMsg && <p className={styles.success}>{successMsg}</p>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <div className={styles.actions}>
        <Button type="submit" variant="primary">
          Lưu cài đặt
        </Button>
      </div>
    </form>
  );
}
