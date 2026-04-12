'use client';

import styles from './TaskTypePicker.module.scss';

interface TaskTypePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: () => void;
  onSelectBooking: () => void;
}

export function TaskTypePicker({ isOpen, onClose, onSelectTask, onSelectBooking }: TaskTypePickerProps) {
  if (!isOpen) return null;

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3 className={styles.title}>Thêm mới</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">✕</button>
        </div>
        <p className={styles.subtitle}>Bạn muốn thêm loại nào?</p>

        <div className={styles.options}>
          <button className={styles.option} onClick={onSelectTask}>
            <span className={styles.optionIcon}>📝</span>
            <div className={styles.optionText}>
              <strong>Công việc cá nhân</strong>
              <span>Nhắc nhở, cho ăn, tắm, uống thuốc...</span>
            </div>
          </button>

          <button className={styles.option} onClick={onSelectBooking}>
            <span className={styles.optionIcon}>🏥</span>
            <div className={styles.optionText}>
              <strong>Đặt lịch hẹn</strong>
              <span>Đặt lịch khám tại phòng khám thú y</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
