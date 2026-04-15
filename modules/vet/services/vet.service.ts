import { appointmentService, petService } from '@/modules/pet-owner/services';
import type { Appointment, PetProfile } from '@/modules/pet-owner/types';

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export const vetService = {
  async getAppointmentsForVet(vetName: string): Promise<Appointment[]> {
    const appointments = await appointmentService.getAllAppointments();
    const normalizedVet = normalizeName(vetName);
    return appointments.filter((appointment) => normalizeName(appointment.veterinarian) === normalizedVet);
  },

  async getPetProfilesForAppointments(appointments: Appointment[]): Promise<PetProfile[]> {
    const petIds = Array.from(new Set(appointments.map((appointment) => appointment.petId)));
    const profiles = await Promise.all(
      petIds.map(async (petId) => {
        try {
          return await petService.getPetProfile(petId);
        } catch {
          return null;
        }
      }),
    );

    return profiles.filter((profile): profile is PetProfile => profile !== null);
  },
};
