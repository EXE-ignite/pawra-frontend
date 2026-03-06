export interface ImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageUrl: string, altText: string) => void;
}
