'use client';

import React from 'react';
import styles from './ChangePasswordForm.module.scss';

export function ChangePasswordForm() {
  return (
    <div className={styles.comingSoon}>
      <span className={styles.comingSoonIcon}>🔒</span>
      <p className={styles.comingSoonTitle}>Tính năng đang phát triển</p>
      <p className={styles.comingSoonDesc}>
        Chức năng đổi mật khẩu chưa được backend hỗ trợ. Vui lòng liên hệ hỗ trợ nếu cần đặt lại mật khẩu.
      </p>
    </div>
  );
}
