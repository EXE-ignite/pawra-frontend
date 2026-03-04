export interface EditPetFormData {
  name: string;
  species: string;
  breed: string;
  birthDate: string; // dd/mm/yyyy display format
  color: string;
  weight: string;
  description: string;
}

export interface EditPetModalProps {
  isOpen: boolean;
  petId: string;
  initialData: {
    name: string;
    species: string;
    breed: string;
    /** Approximate birth date (yyyy-mm-dd) – optional, computed from age if missing */
    birthDate?: string;
    color?: string;
    weight?: number;
    description?: string;
  };
  onClose: () => void;
  /** Called with the updated pet data after a successful save */
  onSuccess: () => void;
}
