export interface AddPetFormData {
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  color?: string;
  weight?: string;
  description?: string;
}

export interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
