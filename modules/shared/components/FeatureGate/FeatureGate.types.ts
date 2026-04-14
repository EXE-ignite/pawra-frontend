import type { ReactNode } from 'react';
import type { FeatureKey } from '../../types/feature-gate.types';

export interface FeatureGateProps {
  /** The feature key to check access for (defined in FEATURE_PLAN_MAP) */
  feature: FeatureKey;
  /**
   * What to render when the user does NOT have access.
   * Omit to use the built-in upgrade prompt.
   */
  fallback?: ReactNode;
  children: ReactNode;
}
