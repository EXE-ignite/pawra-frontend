import { Vaccination, Medication } from '../../types';

export interface HealthRecordsProps {
  vaccinations: Vaccination[];
  medications: Medication[];
  onEdit?: () => void;
}
