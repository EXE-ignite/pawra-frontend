// Pet Owner Services
// Export all services for the pet-owner module

// Dashboard
export * from './dashboard.service';

// Pet
export { petService, default as petServiceDefault } from './pet.service';
export type { CreatePetDto, UpdatePetDto, PetDto } from './pet.service';

// Appointment
export { appointmentService, default as appointmentServiceDefault } from './appointment.service';
export { AppointmentStatus } from './appointment.service';
export type { 
  CreateAppointmentDto, 
  UpdateAppointmentDto, 
  AppointmentDto 
} from './appointment.service';

// Reminder
export { reminderService, default as reminderServiceDefault } from './reminder.service';
export { ReminderType, RecurringType, ReminderLogStatus } from './reminder.service';
export type { 
  CreateReminderDto, 
  UpdateReminderDto, 
  ReminderDto,
  CreateReminderLogDto,
  ReminderLogDto 
} from './reminder.service';

// Vaccination
export { vaccinationService, default as vaccinationServiceDefault } from './vaccination.service';
export type { 
  CreateVaccinationRecordDto, 
  UpdateVaccinationRecordDto, 
  VaccinationRecordDto,
  VaccineDto,
  CreateVaccineDto,
  UpdateVaccineDto 
} from './vaccination.service';

// Pet Profile (mock data - eventually should be moved to services)
export * from './pet-profile.service';

// Clinic
export { clinicService, default as clinicServiceDefault } from './clinic.service';
export type { ClinicDto } from './clinic.service';

// Medication
export { medicationService, default as medicationServiceDefault } from './medication.service';
export type {
  MedicationDto,
  MedicationLogDto,
  CreateMedicationDto,
  UpdateMedicationDto,
  CreateMedicationLogDto,
  MedicationUnit,
  MedicationFrequency,
  MedicationStatus,
  MedicationLogStatus,
} from './medication.service';

// Weight Record
export { weightRecordService, default as weightRecordServiceDefault } from './weight-record.service';
export type {
  WeightRecordDto,
  WeightGrowthChartDto,
  WeightDataPointDto,
  CreateWeightRecordDto,
  UpdateWeightRecordDto,
  WeightUnit,
  WeightSource,
} from './weight-record.service';

// Subscription
export { userSubscriptionService, default as userSubscriptionServiceDefault } from './subscription.service';
