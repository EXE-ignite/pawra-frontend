import { Pet } from '../../types';

export interface AddVaccinationFormData {
  petId: string;
  vaccineId: string;
  clinicId: string;
  vaccinationDate: string; // YYYY-MM-DD
}

export interface AddVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Pre-selected pet ID */
  petId?: string;
  /** List of pets to populate the selector */
  pets?: Pet[];
}
