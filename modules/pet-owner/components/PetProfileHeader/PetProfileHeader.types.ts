export interface PetProfileHeaderProps {
  name: string;
  breed: string;
  age: number;
  ageMonths: number;
  weight: number;
  imageUrl?: string;
  onShareProfile?: () => void;
  onLogEntry?: () => void;
}
