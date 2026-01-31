export interface SignInFormProps {
  onSuccess: (userData: {
    email: string;
    fullName: string;
    role: string;
    expiresAt: string;
  }) => void;
  onToggleMode?: () => void;
}
