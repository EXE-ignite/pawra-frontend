export interface ImageCropModalProps {
  /** Raw image src (object URL) to crop. Pass null/undefined to close. */
  imageSrc: string | null;
  /** Called with the cropped Blob when user confirms */
  onCropDone: (blob: Blob) => void;
  /** Called when user cancels */
  onCancel: () => void;
}
