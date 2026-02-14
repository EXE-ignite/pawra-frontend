import { PetProfile } from '../../types';

export interface PetProfilePageProps {
  petProfile: PetProfile;
  onShareProfile?: () => void;
  onLogEntry?: () => void;
  onEditHealth?: () => void;
  onEditGrowth?: () => void;
  onEditRoutine?: () => void;
  onUploadDocument?: () => void;
  onViewDocument?: (documentId: string) => void;
  onToggleActivity?: (activityId: string) => void;
}
