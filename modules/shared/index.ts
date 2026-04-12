export { Button } from './components/Button';
export { MainLayout } from './layouts/MainLayout';

export type { ButtonProps } from './components/Button';
export type { MainLayoutProps } from './layouts/MainLayout';

// Contexts
export { AuthProvider, useAuth, ThemeProvider, useTheme, LanguageProvider, useTranslation, SubscriptionProvider, useSubscription } from './contexts';
export type { Locale } from './contexts';

// Feature Gating
export { FeatureGate } from './components/FeatureGate';
export type { FeatureGateProps } from './components/FeatureGate';
export type { FeatureKey, PlanTier } from './types/feature-gate.types';
export { FEATURE_PLAN_MAP, PLAN_HIERARCHY } from './types/feature-gate.types';

// API Service
export { apiService, api, authService } from './services';

// Constants
export * from './constants/routes';

// API Types
export type { 
  ApiResponse, 
  ApiError, 
  PaginationParams, 
  PaginatedResponse,
  RequestConfig 
} from './types/api.types';

// Auth Types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User
} from './types/auth.types';
