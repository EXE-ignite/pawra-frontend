'use client';

import { useSubscription } from '../../contexts/SubscriptionContext';
import { FEATURE_PLAN_MAP } from '../../types/feature-gate.types';
import type { FeatureGateProps } from './FeatureGate.types';
import styles from './FeatureGate.module.scss';

// ---------------------------------------------------------------------------
// Default locked fallback UI
// ---------------------------------------------------------------------------
function LockedFallback({ requiredPlan }: { requiredPlan: string }) {
  return (
    <div className={styles.locked}>
      <span className={styles.lockIcon}>🔒</span>
      <p className={styles.message}>
        Tính năng này yêu cầu gói <strong>{requiredPlan}</strong> trở lên
      </p>
      <a href="/pet-owner/subscription" className={styles.upgradeLink}>
        Nâng cấp ngay
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FeatureGate
// ---------------------------------------------------------------------------
/**
 * Renders `children` only when the authenticated user's subscription meets
 * the minimum plan required for `feature`.
 *
 * @example
 * <FeatureGate feature="booking.priority">
 *   <PriorityBookingForm />
 * </FeatureGate>
 *
 * // Custom fallback:
 * <FeatureGate feature="vet.online" fallback={<p>VIP only</p>}>
 *   <OnlineVetChat />
 * </FeatureGate>
 */
export function FeatureGate({ feature, fallback, children }: FeatureGateProps) {
  const { hasAccess, isDevOverride } = useSubscription();

  if (!hasAccess(feature)) {
    return fallback !== undefined ? (
      <>{fallback}</>
    ) : (
      <LockedFallback requiredPlan={FEATURE_PLAN_MAP[feature]} />
    );
  }

  return (
    <>
      {children}
      {/* Visible reminder badge in dev when override is active */}
      {isDevOverride && (
        <div className={styles.devBanner} aria-hidden="true">
          DEV OVERRIDE
        </div>
      )}
    </>
  );
}
