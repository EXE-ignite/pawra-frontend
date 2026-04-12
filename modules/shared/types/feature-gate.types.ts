// ---------------------------------------------------------------------------
// Feature Gating — Plan Hierarchy & Feature Map
// ---------------------------------------------------------------------------

/**
 * Plan tiers in ascending order of access level.
 * Must match planName values returned by the subscription API.
 */
export type PlanTier = 'Free' | 'Basic' | 'Premium' | 'VIP';

/** Numeric rank — higher number = more access */
export const PLAN_HIERARCHY: Record<PlanTier, number> = {
  Free: 0,
  Basic: 1,
  Premium: 2,
  VIP: 3,
};

/**
 * Map each feature key to the MINIMUM plan required.
 * Add a new entry here whenever you want to gate a feature.
 *
 * @example
 * // In a component:
 * const { hasAccess } = useSubscription();
 * if (!hasAccess('booking.priority')) return <UpgradePrompt />;
 */
export const FEATURE_PLAN_MAP = {
  // ── Pet management ──────────────────────────────────────────────────────
  'pet.multiple': 'Basic',       // Track more than 1 pet
  'pet.unlimited': 'Premium',    // Unlimited pets

  // ── Reminders ────────────────────────────────────────────────────────────
  'reminder.basic': 'Free',      // Basic reminders
  'reminder.smart': 'Basic',     // Smart / recurring reminders

  // ── Booking ──────────────────────────────────────────────────────────────
  'booking.standard': 'Basic',   // Regular appointment booking
  'booking.priority': 'Premium', // Priority booking slot

  // ── Health reports ────────────────────────────────────────────────────────
  'report.basic': 'Basic',       // Basic health summary
  'report.advanced': 'Premium',  // Advanced analytics & charts

  // ── Vet consultation ─────────────────────────────────────────────────────
  'vet.online': 'VIP',           // Online vet consultation

  // ── Support ──────────────────────────────────────────────────────────────
  'support.priority': 'VIP',     // VIP support channel
} as const satisfies Record<string, PlanTier>;

export type FeatureKey = keyof typeof FEATURE_PLAN_MAP;
