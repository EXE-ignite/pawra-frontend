'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor, BlogEditorFormData } from '@/modules/blog/components/BlogEditor';
import { blogService } from '@/modules/blog/services';

export function CreateBlogPage() {
  const router = useRouter();

  const handleSave = async (data: BlogEditorFormData, status: 'Draft' | 'Published') => {
    try {
      await blogService.createPost({ ...data, status });
      router.push('/admin/blog');
    } catch (error: any) {
      const message = error?.message || 'Failed to create post';
      const status = error?.status ?? error?.response?.status ?? 0;
      const errors = error?.errors || error?.response?.data?.errors;
      console.error('Error creating post:', message, '| status:', status, '| errors:', errors);
      alert(`Failed to create post: ${message}`);
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  return (
    <BlogEditor
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
