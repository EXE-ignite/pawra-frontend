'use client';

import React, { useState } from 'react';
import { Button } from '@/modules/shared';
import { changePassword } from '../../services/account-profile.service';
import styles from './ChangePasswordForm.module.scss';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccessMsg('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setErrorMsg(msg || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="currentPassword">Mật khẩu hiện tại</label>
        <input
          id="currentPassword"
          type="password"
          className={styles.input}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="newPassword">Mật khẩu mới</label>
        <input
          id="newPassword"
          type="password"
          className={styles.input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
        <input
          id="confirmPassword"
          type="password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      {successMsg && <p className={styles.success}>{successMsg}</p>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </Button>
      </div>
    </form>
  );
}
