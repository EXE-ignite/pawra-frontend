import { apiService } from '@/modules/shared/services';
import { Pet, Appointment, DashboardStats } from '../types';

/**
 * Fetch all pets for the current user.
 * Maps 1-1 from backend `/api/Pet` response into our `Pet` type.
 */
export async function fetchUserPets(): Promise<Pet[]> {
  try {
    const response = await apiService.get<Pet[]>('/Pet');
    return response.data ?? [];
  } catch (error) {
    console.error('❌ [DASHBOARD] Failed to load pets:', error);
    return [];
  }
}

/**
 * Fetch upcoming appointments for the current user from `/api/Appointment`.
 */
export async function fetchUpcomingAppointments(): Promise<Appointment[]> {
  try {
    const response = await apiService.get<Appointment[]>('/Appointment');
    const appointments = response.data ?? [];

    // Basic filtering: keep only scheduled / future appointments if fields exist
    const now = new Date();
    return appointments.filter((appointment) => {
      const hasStatus = 'status' in appointment;
      const isScheduled = !hasStatus || appointment.status === 'scheduled';

      const dateValue = (appointment as any).date;
      const isFuture =
        typeof dateValue === 'string'
          ? !Number.isNaN(Date.parse(dateValue)) && new Date(dateValue) >= now
          : true;

      return isScheduled && isFuture;
    });
  } catch (error) {
    console.error('❌ [DASHBOARD] Failed to load appointments:', error);
    return [];
  }
}

/**
 * Build high-level dashboard stats based on pets, appointments and (optionally) payments.
 * Currently derives values from the fetched pets & appointments.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [pets, appointments] = await Promise.all([
      fetchUserPets(),
      fetchUpcomingAppointments(),
    ]);

    const upcomingAppointments = appointments.length;
    const completedVisits = appointments.filter(
      (appointment) => (appointment as any).status === 'completed',
    ).length;

    // TODO: When payment API contract is finalized, compute real pending payments
    const pendingPayments = 0;

    return {
      totalPets: pets.length,
      upcomingAppointments,
      completedVisits,
      pendingPayments,
    };
  } catch (error) {
    console.error('❌ [DASHBOARD] Failed to build stats:', error);
    return {
      totalPets: 0,
      upcomingAppointments: 0,
      completedVisits: 0,
      pendingPayments: 0,
    };
  }
}
