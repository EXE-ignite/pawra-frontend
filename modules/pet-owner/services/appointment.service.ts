import { apiService } from '@/modules/shared/services';
import type { Appointment } from '../types';

// Flag để chuyển đổi giữa mock data và real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * Appointment Service
 * Handles all appointment CRUD operations
 * 
 * Backend endpoints:
 * - POST /api/Appointment/create - Create new appointment
 * - GET /api/Appointment/{id} - Get appointment by ID
 * - PUT /api/Appointment/update/{id} - Update appointment
 * - DELETE /api/Appointment/{id} - Delete appointment
 * - GET /api/Appointment - Get all appointments (paginated)
 */

// Types matching backend DTOs
export interface CreateAppointmentDto {
  petId: string;
  veterinarianId: string;
  clinicId: string;
  appointmentTime: string; // ISO datetime string
  serviceId?: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  appointmentTime?: string;
  status?: AppointmentStatus;
}

// Backend status enum
export enum AppointmentStatus {
  Scheduled = 0,
  Completed = 1,
  Cancelled = 2,
  NoShow = 3,
}

export interface AppointmentDto {
  id: string;
  petId: string;
  pet?: {
    id: string;
    name: string;
  };
  veterinarianId: string;
  veterinarian?: {
    id: string;
    account?: {
      fullName: string;
    };
  };
  clinicId: string;
  clinic?: {
    id: string;
    name: string;
  };
  appointmentTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Mock data for development
const mockAppointments: Appointment[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Max',
    veterinarian: 'Dr. Sarah Johnson',
    date: '2026-02-28',
    time: '10:00 AM',
    type: 'checkup',
    status: 'scheduled'
  },
  {
    id: '2',
    petId: '2',
    petName: 'Luna',
    veterinarian: 'Dr. Michael Chen',
    date: '2026-03-01',
    time: '2:30 PM',
    type: 'vaccination',
    status: 'scheduled'
  }
];

/**
 * Transform backend AppointmentDto to frontend Appointment type
 */
function transformAppointmentData(dto: AppointmentDto): Appointment {
  const appointmentDate = new Date(dto.appointmentTime);
  
  // Map backend status enum to frontend string
  const statusMap: Record<AppointmentStatus, Appointment['status']> = {
    [AppointmentStatus.Scheduled]: 'scheduled',
    [AppointmentStatus.Completed]: 'completed',
    [AppointmentStatus.Cancelled]: 'cancelled',
    [AppointmentStatus.NoShow]: 'cancelled',
  };

  return {
    id: dto.id,
    petId: dto.petId,
    petName: dto.pet?.name || 'Unknown',
    veterinarian: dto.veterinarian?.account?.fullName || 'Unknown',
    date: appointmentDate.toISOString().split('T')[0],
    time: appointmentDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    }),
    type: 'checkup', // Default, need to map from service type
    status: statusMap[dto.status] || 'scheduled',
  };
}

class AppointmentService {
  private readonly endpoint = '/Appointment';

  /**
   * Get all appointments (paginated)
   * Backend: GET /api/Appointment?pageSize=100&pageNumber=1
   */
  async getAllAppointments(pageSize = 100, pageNumber = 1): Promise<Appointment[]> {
    if (USE_MOCK) {
      return mockAppointments;
    }

    try {
      const response = await apiService.get<AppointmentDto[] | PaginatedResponse<AppointmentDto>>(
        `${this.endpoint}?pageSize=${pageSize}&pageNumber=${pageNumber}`
      );
      
      const appointments = Array.isArray(response.data) 
        ? response.data 
        : response.data?.items || [];
      
      return appointments.map(transformAppointmentData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Get upcoming appointments for current user
   * Note: Backend may need endpoint like GET /api/Appointment/customer/{customerId}
   */
  async getUpcomingAppointments(): Promise<Appointment[]> {
    if (USE_MOCK) {
      return mockAppointments.filter(a => a.status === 'scheduled');
    }

    try {
      const response = await apiService.get<AppointmentDto[]>(`${this.endpoint}`);
      const appointments = Array.isArray(response.data) ? response.data : [];
      
      // Filter to only scheduled (upcoming) appointments
      const upcoming = appointments
        .filter(a => a.status === AppointmentStatus.Scheduled)
        .filter(a => new Date(a.appointmentTime) >= new Date())
        .map(transformAppointmentData);
      
      return upcoming;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  }

  /**
   * Get appointment by ID
   * Backend: GET /api/Appointment/{id}
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    if (USE_MOCK) {
      const appointment = mockAppointments.find(a => a.id === id);
      if (!appointment) throw new Error('Appointment not found');
      return appointment;
    }

    try {
      const response = await apiService.get<AppointmentDto>(`${this.endpoint}/${id}`);
      return transformAppointmentData(response.data);
    } catch (error) {
      console.error('Error fetching appointment by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new appointment
   * Backend: POST /api/Appointment/create
   */
  async createAppointment(data: {
    petId: string;
    veterinarianId: string;
    clinicId: string;
    appointmentTime: Date | string;
    serviceId?: string;
    notes?: string;
  }): Promise<Appointment> {
    if (USE_MOCK) {
      const newAppointment: Appointment = {
        id: String(Date.now()),
        petId: data.petId,
        petName: 'Pet',
        veterinarian: 'Dr. Unknown',
        date: new Date(data.appointmentTime).toISOString().split('T')[0],
        time: new Date(data.appointmentTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        type: 'checkup',
        status: 'scheduled',
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }

    try {
      const createDto: CreateAppointmentDto = {
        petId: data.petId,
        veterinarianId: data.veterinarianId,
        clinicId: data.clinicId,
        appointmentTime: data.appointmentTime instanceof Date 
          ? data.appointmentTime.toISOString() 
          : data.appointmentTime,
        serviceId: data.serviceId,
        notes: data.notes,
      };

      const response = await apiService.post<AppointmentDto>(`${this.endpoint}/create`, createDto);
      return transformAppointmentData(response.data);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Update an appointment
   * Backend: PUT /api/Appointment/update/{id}
   */
  async updateAppointment(id: string, data: {
    appointmentTime?: Date | string;
    status?: 'scheduled' | 'completed' | 'cancelled';
  }): Promise<Appointment> {
    if (USE_MOCK) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      
      if (data.status) {
        mockAppointments[index].status = data.status;
      }
      if (data.appointmentTime) {
        mockAppointments[index].date = new Date(data.appointmentTime).toISOString().split('T')[0];
      }
      
      return mockAppointments[index];
    }

    try {
      const updateDto: UpdateAppointmentDto = {};
      
      if (data.appointmentTime) {
        updateDto.appointmentTime = data.appointmentTime instanceof Date 
          ? data.appointmentTime.toISOString() 
          : data.appointmentTime;
      }
      
      if (data.status) {
        const statusMap: Record<string, AppointmentStatus> = {
          'scheduled': AppointmentStatus.Scheduled,
          'completed': AppointmentStatus.Completed,
          'cancelled': AppointmentStatus.Cancelled,
        };
        updateDto.status = statusMap[data.status];
      }

      const response = await apiService.put<AppointmentDto>(`${this.endpoint}/update/${id}`, updateDto);
      return transformAppointmentData(response.data);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   * Backend: PUT /api/Appointment/update/{id} with status = Cancelled
   */
  async cancelAppointment(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      mockAppointments[index].status = 'cancelled';
      return;
    }

    try {
      await apiService.put(`${this.endpoint}/update/${id}`, {
        status: AppointmentStatus.Cancelled,
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Delete an appointment
   * Backend: DELETE /api/Appointment/{id}
   */
  async deleteAppointment(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      mockAppointments.splice(index, 1);
      return;
    }

    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
export default appointmentService;
