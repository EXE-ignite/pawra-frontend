'use client';

import React, { useState } from 'react';
import { Button } from '@/modules/shared';
import type { AccountProfile, UpdateProfileRequest } from '../../types/account-profile.types';
import styles from './BasicInfoForm.module.scss';

interface BasicInfoFormProps {
  profile: AccountProfile;
  onSave: (data: UpdateProfileRequest) => Promise<void>;
}

export function BasicInfoForm({ profile, onSave }: BasicInfoFormProps) {
  const [form, setForm] = useState<UpdateProfileRequest>({
    fullName: profile.fullName,
    phone: profile.phone ?? '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev: UpdateProfileRequest) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await onSave(form);
      setSuccessMsg('Cập nhật thông tin thành công!');
    } catch {
      setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.avatarSection}>
        <div className={styles.avatar}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.fullName} className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarInitial}>
              {profile.fullName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="fullName">
          Họ và tên
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={profile.email}
          className={styles.input}
          disabled
        />
        <span className={styles.hint}>Email không thể thay đổi</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="phone">
          Số điện thoại
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className={styles.input}
          placeholder="Nhập số điện thoại"
        />
        {!profile.customerId && (
          <span className={styles.hint}>SĐT sẽ được đồng bộ sau khi tạo hồ sơ khách hàng</span>
        )}
      </div>

      {successMsg && <p className={styles.success}>{successMsg}</p>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" isLoading={isSaving}>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
