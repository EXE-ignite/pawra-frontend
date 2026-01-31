export interface SignUpFormProps {
  onSuccess: (userData: {
    email: string;
    fullName: string;
    role: string;
    expiresAt: string;
  }) => void;
  onToggleMode?: () => void;
}
