'use client';

import React from 'react';
import type { SubscriptionPlan } from '../../types';
import { userSubscriptionService } from '../../services';
import styles from './PaymentInfoModal.module.scss';

interface PaymentInfoModalProps {
  plan: SubscriptionPlan | null;
  userEmail?: string;
  onConfirm?: (plan: SubscriptionPlan) => Promise<void>;
  onClose: () => void;
}

const BANK_NAME = 'Vietcombank';           // ← đổi tên ngân hàng nếu cần
const BANK_ACCOUNT = '1234567890';         // ← đổi số tài khoản
const BANK_OWNER = 'PAWRA COMPANY';        // ← đổi tên chủ tài khoản
const SUPPORT_ZALO = '0912345678';         // ← đổi số Zalo hỗ trợ
const SUPPORT_EMAIL = 'support@pawra.io.vn'; // ← đổi email hỗ trợ
const ACTIVATION_HOURS = 24;
const QR_IMAGE_PATH = '/qr-payment.png';   // ← đặt ảnh QR vào public/qr-payment.png

export function PaymentInfoModal({ plan, userEmail, onConfirm, onClose }: PaymentInfoModalProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  if (!plan) return null;

  const transferContent = `PAWRA ${userEmail ?? ''} ${plan.name}`.trim();
  const formattedPrice = userSubscriptionService.formatPrice(plan.price, plan.currency);
  const duration = userSubscriptionService.formatDuration(plan.durationInDays);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    void e; // không đóng khi click overlay
  };

  const handleConfirmTransfer = async () => {
    if (!onConfirm || submitting || submitted) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onConfirm(plan);
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể gửi xác nhận. Vui lòng thử lại hoặc liên hệ hỗ trợ.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Thông tin đăng ký gói</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <div className={styles.planSummary}>
          <div className={styles.planName}>{plan.name}</div>
          <div className={styles.planPrice}>
            {formattedPrice}
            <span className={styles.planDuration}>{duration}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Hướng dẫn đăng ký</h3>
          <ol className={styles.steps}>
            <li>Chuyển khoản theo thông tin bên dưới.</li>
            <li>
              Ghi nội dung chuyển khoản chính xác:
              <span className={styles.transferContent}>{transferContent}</span>
            </li>
            <li>Liên hệ đội ngũ hỗ trợ để xác nhận. Admin sẽ kích hoạt gói trong vòng <strong>{ACTIVATION_HOURS} giờ</strong>.</li>
          </ol>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin chuyển khoản</h3>
          <div className={styles.bankLayout}>
            <div className={styles.qrWrapper}>
              <img
                src={QR_IMAGE_PATH}
                alt="QR chuyển khoản"
                className={styles.qrImage}
              />
              <span className={styles.qrCaption}>Quét để chuyển khoản</span>
            </div>
            <div className={styles.bankInfo}>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>Ngân hàng</span>
                <span className={styles.bankValue}>{BANK_NAME}</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>Số TK</span>
                <span className={styles.bankValue}>{BANK_ACCOUNT}</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>Chủ TK</span>
                <span className={styles.bankValue}>{BANK_OWNER}</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>Số tiền</span>
                <span className={`${styles.bankValue} ${styles.amount}`}>{formattedPrice}</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>Nội dung</span>
                <CopyField value={transferContent} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Liên hệ hỗ trợ</h3>
          <div className={styles.contactList}>
            <a
              className={styles.contactLink}
              href={`https://zalo.me/${SUPPORT_ZALO}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.contactIcon}>💬</span>
              Zalo: {SUPPORT_ZALO}
            </a>
            <a className={styles.contactLink} href={`mailto:${SUPPORT_EMAIL}`}>
              <span className={styles.contactIcon}>✉️</span>
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>

        {onConfirm && submitted && (
          <div className={styles.confirmSection}>
            <div className={styles.successMessage}>
              ✅ Đã gửi xác nhận! Admin sẽ kích hoạt gói trong vòng <strong>{ACTIVATION_HOURS} giờ</strong>.
            </div>
          </div>
        )}

        {onConfirm && !submitted && submitError && (
          <div className={styles.confirmSection}>
            <p className={styles.submitError}>{submitError}</p>
          </div>
        )}

        <div className={styles.modalFooter}>
          {onConfirm && !submitted && (
            <button
              className={styles.confirmButton}
              onClick={handleConfirmTransfer}
              disabled={submitting}
              type="button"
            >
              {submitting ? 'Đang gửi...' : '✅ Tôi đã chuyển khoản – Gửi xác nhận'}
            </button>
          )}
          {(!onConfirm || submitted) && (
            <button className={styles.closeFooterButton} onClick={onClose} type="button">
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Internal helper: copy-to-clipboard field
// ------------------------------------------------------------------
function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <span className={styles.copyField}>
      <span className={styles.copyValue}>{value}</span>
      <button className={styles.copyButton} onClick={handleCopy} type="button">
        {copied ? '✓ Đã sao chép' : 'Sao chép'}
      </button>
    </span>
  );
}
