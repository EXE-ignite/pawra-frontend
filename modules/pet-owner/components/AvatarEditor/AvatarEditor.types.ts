export interface AvatarEditorProps {
  currentAvatarUrl?: string;
  userInitials?: string;
  onAvatarChange: (newUrl: string) => void;
  isSaving?: boolean;
}

export type AvatarTab = 'presets' | 'upload';

export interface PresetAvatar {
  label: string;
  path: string;
}
