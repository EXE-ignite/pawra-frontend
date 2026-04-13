'use client';

import { useRouter } from 'next/navigation';
import styles from './TaskTypePicker.module.scss';

interface TaskTypePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: () => void;
  onSelectBooking: () => void;
  /** Pass false to show the booking option as locked (requires Basic+) */
  canBook?: boolean;
}

export function TaskTypePicker({ isOpen, onClose, onSelectTask, onSelectBooking, canBook = true }: TaskTypePickerProps) {
  const router = useRouter();

  if (!isOpen) return null;

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleBookingClick() {
    if (!canBook) {
      onClose();
      router.push('/pet-owner/subscription');
      return;
    }
    onSelectBooking();
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

          <button
            className={`${styles.option} ${!canBook ? styles.optionLocked : ''}`}
            onClick={handleBookingClick}
            title={!canBook ? 'Yêu cầu gói Basic trở lên' : undefined}
          >
            <span className={styles.optionIcon}>{canBook ? '🏥' : '🔒'}</span>
            <div className={styles.optionText}>
              <strong>Đặt lịch hẹn {!canBook && <span className={styles.planBadge}>Basic+</span>}</strong>
              <span>{canBook ? 'Đặt lịch khám tại phòng khám thú y' : 'Nâng cấp lên Basic để đặt lịch hẹn'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
