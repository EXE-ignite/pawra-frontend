import { Pet, Appointment, DashboardStats } from '../types';
import { petService } from './pet.service';
import { appointmentService } from './appointment.service';

/**
 * Dashboard Service
 * Aggregates data from multiple services for the pet owner dashboard
 * 
 * This service coordinates calls to:
 * - Pet Service: for user's pets
 * - Appointment Service: for upcoming appointments
 * - Payment Service (TODO): for pending payments
 */

/**
 * Fetch dashboard statistics
 * Aggregates counts from various services
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    // Fetch data in parallel for better performance
    const [pets, appointments] = await Promise.all([
      petService.getUserPets().catch(() => []),
      appointmentService.getAllAppointments().catch(() => []),
    ]);

    const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
    const completedAppointments = appointments.filter(a => a.status === 'completed');

    return {
      totalPets: pets.length,
      upcomingAppointments: upcomingAppointments.length,
      completedVisits: completedAppointments.length,
      pendingPayments: 0, // TODO: Integrate Payment Service
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default stats on error
    return {
      totalPets: 0,
      upcomingAppointments: 0,
      completedVisits: 0,
      pendingPayments: 0,
    };
  }
}

/**
 * Fetch user's pets
 */
export async function fetchUserPets(): Promise<Pet[]> {
  try {
    return await petService.getUserPets();
  } catch (error) {
    console.error('Error fetching user pets:', error);
    return [];
  }
}

/**
 * Fetch upcoming appointments for current user
 */
export async function fetchUpcomingAppointments(): Promise<Appointment[]> {
  try {
    return await appointmentService.getUpcomingAppointments();
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return [];
  }
}
