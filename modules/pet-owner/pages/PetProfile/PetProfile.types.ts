import { PetProfile } from '../../types';

export interface PetProfilePageProps {
  petProfile: PetProfile;
  onEditProfile?: () => void;
  onDeletePet?: () => void;
  onExportPdf?: () => void;
  onAddRecord?: () => void;
  // Legacy handlers kept for compatibility
  onShareProfile?: () => void;
  onLogEntry?: () => void;
  onEditHealth?: () => void;
  onEditGrowth?: () => void;
  onEditRoutine?: () => void;
  onUploadDocument?: () => void;
  onViewDocument?: (documentId: string) => void;
  onToggleActivity?: (activityId: string) => void;
}
