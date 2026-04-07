'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/modules/shared';
import { BasicInfoForm } from '../../components/BasicInfoForm';
import { ChangePasswordForm } from '../../components/ChangePasswordForm';
import { NotificationSettings } from '../../components/NotificationSettings';
import * as profileService from '../../services/account-profile.service';
import type {
  AccountProfile,
  NotificationPreferences,
  ProfileTab,
  UpdateProfileRequest,
} from '../../types/account-profile.types';
import styles from './AccountProfilePage.module.scss';

const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'basic-info', label: 'Thông tin cá nhân' },
  { key: 'change-password', label: 'Đổi mật khẩu' },
  { key: 'notifications', label: 'Thông báo' },
];

export function AccountProfilePage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic-info');
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(
    profileService.getNotificationPreferences()
  );

  const { data: profile, isLoading, error } = useQuery<AccountProfile>({
    queryKey: ['pet-owner', 'profile'],
    queryFn: profileService.getProfile,
    placeholderData: user
      ? { accountId: '', fullName: user.fullName, email: user.email }
      : undefined,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      profileService.updateProfile(profile!, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['pet-owner', 'profile'], updated);
      if (user) updateUser({ ...user, fullName: updated.fullName });
    },
  });

  function handleSaveNotifications(data: NotificationPreferences) {
    profileService.saveNotificationPreferences(data);
    setNotifPrefs(data);
  }

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <span className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className={styles.errorWrapper}>
        <p className={styles.errorText}>Không thể tải thông tin tài khoản.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tài khoản của tôi</h1>
        <p className={styles.subtitle}>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <section className={styles.content}>
          {activeTab === 'basic-info' && profile && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
              <p className={styles.sectionDesc}>Cập nhật tên và số điện thoại của bạn</p>
              <BasicInfoForm
                profile={profile}
                onSave={async (data) => { await updateProfileMutation.mutateAsync(data); }}
              />
            </div>
          )}

          {activeTab === 'change-password' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Đổi mật khẩu</h2>
              <p className={styles.sectionDesc}>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
              <ChangePasswordForm />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Cài đặt thông báo</h2>
              <p className={styles.sectionDesc}>Chọn loại thông báo bạn muốn nhận</p>
              <NotificationSettings
                preferences={notifPrefs}
                onSave={handleSaveNotifications}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
