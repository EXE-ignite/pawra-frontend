import { Document } from '../../types';

export interface DocumentVaultProps {
  documents: Document[];
  onUpload?: () => void;
  onView?: (documentId: string) => void;
}
