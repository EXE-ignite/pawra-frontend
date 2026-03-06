export interface BlogEditorFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnailUrl: string;
  categoryId: string;
  status: 'Draft' | 'Published';
}

export interface BlogEditorProps {
  mode: 'create' | 'edit';
  initialData?: BlogEditorFormData;
  postId?: string;
  onSave: (data: BlogEditorFormData, status: 'Draft' | 'Published') => Promise<void>;
  onCancel: () => void;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
