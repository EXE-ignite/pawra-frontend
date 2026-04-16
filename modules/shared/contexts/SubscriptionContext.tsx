'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import type { PlanTier, FeatureKey, SubscriptionStatus } from '../types/feature-gate.types';
import { PLAN_HIERARCHY, FEATURE_PLAN_MAP, PLAN_MAX_PETS, normalizePlanTier } from '../types/feature-gate.types';

// ---------------------------------------------------------------------------
// Dev override
// ---------------------------------------------------------------------------
// In `.env.local` (never commit this file), set:
//   NEXT_PUBLIC_DEV_SUBSCRIPTION_OVERRIDE=VIP
// to bypass subscription checks during local development/testing.
// This variable is ignored in production (NODE_ENV !== 'development').
const IS_DEV = process.env.NODE_ENV === 'development';
const DEV_OVERRIDE = process.env.NEXT_PUBLIC_DEV_SUBSCRIPTION_OVERRIDE as PlanTier | undefined;
const EFFECTIVE_DEV_OVERRIDE: PlanTier | undefined =
  IS_DEV && DEV_OVERRIDE && PLAN_HIERARCHY[DEV_OVERRIDE] !== undefined
    ? DEV_OVERRIDE
    : undefined;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface SubscriptionContextType {
  /** The user's current effective plan tier */
  currentPlan: PlanTier;
  /** Raw subscription status: 'none' when user has no subscription */
  subscriptionStatus: SubscriptionStatus | 'none';
  isLoading: boolean;
  /** Returns true if the user's plan meets the minimum requirement for a feature */
  hasAccess: (feature: FeatureKey) => boolean;
  /** Maximum number of pets allowed under the current plan (Infinity = unlimited) */
  maxPets: number;
  /** True when plan is overridden by NEXT_PUBLIC_DEV_SUBSCRIPTION_OVERRIDE */
  isDevOverride: boolean;
  /** Re-fetch subscription from backend — call this after the user subscribes or admin activates */
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('Free');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | 'none'>('none');
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated || EFFECTIVE_DEV_OVERRIDE) return;

    setIsLoading(true);
    try {
      // 1. Get accountId from profile
      const { getProfile } = await import('@/modules/pet-owner/services/account-profile.service');
      const profile = await getProfile();
      if (!profile.accountId) {
        if (IS_DEV) console.warn('[FeatureGate] profile.accountId is empty — subscription not fetched.');
        setCurrentPlan('Free');
        setSubscriptionStatus('none');
        return;
      }

      // 2. Get subscription + plan list in parallel (plan list used to enrich planName)
      const { userSubscriptionService } = await import('@/modules/pet-owner/services/subscription.service');
      const [sub, plans] = await Promise.all([
        userSubscriptionService.getCurrentSubscription(profile.accountId),
        userSubscriptionService.getAvailablePlans().catch(() => []),
      ]);

      if (!sub) {
        setCurrentPlan('Free');
        setSubscriptionStatus('none');
        return;
      }

      setSubscriptionStatus(sub.status);

      if (sub.status === 'active') {
        // Enrich planName from plans list — handles cases where API doesn't embed plan details
        const matchedPlan = plans.find((p) => p.id === sub.planId);
        const resolvedPlanName = matchedPlan?.name || sub.planName;

        const plan = normalizePlanTier(resolvedPlanName, sub.planId);
        if (IS_DEV && plan === 'Free') {
          console.warn(`[FeatureGate] planName "${resolvedPlanName}" / planId "${sub.planId}" could not be mapped — defaulting to Free.`);
        }
        setCurrentPlan(plan);
      } else {
        if (IS_DEV) console.warn(`[FeatureGate] Subscription status is "${sub.status}" — access set to Free.`);
        setCurrentPlan('Free');
      }
    } catch (err) {
      if (IS_DEV) console.warn('[FeatureGate] Failed to fetch subscription:', err);
      setCurrentPlan('Free');
      setSubscriptionStatus('none');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPlan('Free');
      setSubscriptionStatus('none');
      return;
    }

    // Dev override: skip API call entirely
    if (EFFECTIVE_DEV_OVERRIDE) {
      setCurrentPlan(EFFECTIVE_DEV_OVERRIDE);
      if (IS_DEV) {
        // eslint-disable-next-line no-console
        console.warn(
          `[FeatureGate] DEV OVERRIDE active — plan forced to "${EFFECTIVE_DEV_OVERRIDE}". ` +
          'Remove NEXT_PUBLIC_DEV_SUBSCRIPTION_OVERRIDE from .env.local before deploying.',
        );
      }
      return;
    }

    let cancelled = false;
    fetchSubscription().then(() => {}).catch(() => {});
    return () => { cancelled = true; void cancelled; };
  }, [isAuthenticated, fetchSubscription]);

  const hasAccess = (feature: FeatureKey): boolean => {
    const required = FEATURE_PLAN_MAP[feature];
    return PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[required];
  };

  const maxPets = PLAN_MAX_PETS[currentPlan];

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        subscriptionStatus,
        isLoading,
        hasAccess,
        maxPets,
        isDevOverride: !!EFFECTIVE_DEV_OVERRIDE,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
