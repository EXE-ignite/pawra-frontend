export interface BookingStep {
  id: number;
  label: string;
}

export interface BookingFormData {
  clinicId: string;
  clinicName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  veterinarianId: string;
  veterinarianName: string;
  petId: string;
  petName: string;
  appointmentDate: string; // yyyy-MM-dd
  appointmentTime: string; // HH:mm
  notes: string;
}

export const BOOKING_STEPS: BookingStep[] = [
  { id: 1, label: 'Chọn dịch vụ' },
  { id: 2, label: 'Chọn phòng khám' },
  { id: 3, label: 'Chọn thời gian' },
  { id: 4, label: 'Xác nhận' },
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
];
