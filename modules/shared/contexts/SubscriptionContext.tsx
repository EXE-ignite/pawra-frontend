'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import type { PlanTier, FeatureKey } from '../types/feature-gate.types';
import { PLAN_HIERARCHY, FEATURE_PLAN_MAP, PLAN_MAX_PETS } from '../types/feature-gate.types';

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
  isLoading: boolean;
  /** Returns true if the user's plan meets the minimum requirement for a feature */
  hasAccess: (feature: FeatureKey) => boolean;
  /** Maximum number of pets allowed under the current plan (Infinity = unlimited) */
  maxPets: number;
  /** True when plan is overridden by NEXT_PUBLIC_DEV_SUBSCRIPTION_OVERRIDE */
  isDevOverride: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('Free');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPlan('Free');
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

    // Fetch real subscription from backend
    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        // 1. Get accountId from profile
        const { getProfile } = await import('@/modules/pet-owner/services/account-profile.service');
        const profile = await getProfile();
        if (cancelled || !profile.accountId) return;

        // 2. Get current active subscription
        const { userSubscriptionService } = await import('@/modules/pet-owner/services/subscription.service');
        const sub = await userSubscriptionService.getCurrentSubscription(profile.accountId);

        if (cancelled) return;

        if (sub && sub.status === 'active') {
          const plan = sub.planName as PlanTier;
          setCurrentPlan(PLAN_HIERARCHY[plan] !== undefined ? plan : 'Free');
        } else {
          setCurrentPlan('Free');
        }
      } catch {
        if (!cancelled) setCurrentPlan('Free');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const hasAccess = (feature: FeatureKey): boolean => {
    const required = FEATURE_PLAN_MAP[feature];
    return PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[required];
  };

  const maxPets = PLAN_MAX_PETS[currentPlan];

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        isLoading,
        hasAccess,
        maxPets,
        isDevOverride: !!EFFECTIVE_DEV_OVERRIDE,
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
