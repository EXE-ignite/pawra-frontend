export interface RichTextEditorProps {
  /** Initial HTML content */
  content?: string;
  
  /** Callback when content changes */
  onChange: (html: string) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether editor is in error state */
  hasError?: boolean;
  
  /** Disable editing */
  disabled?: boolean;
  
  /** Minimum height in pixels */
  minHeight?: number;
}

export interface EditorToolbarButton {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  isActive?: boolean;
  disabled?: boolean;
}
