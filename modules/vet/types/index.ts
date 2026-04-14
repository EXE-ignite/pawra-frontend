// Re-export shared subscription types for vet module
export type { SubscriptionPlan, UserSubscription, SubscribePayload } from '@/modules/pet-owner/types';

// Clinic manager types
export type {
  Clinic,
  ClinicService,
  ClinicVaccine,
  Veterinarian,
  ClinicStats,
  ClinicManagerTab,
} from './clinic-manager.types';
