'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor, BlogEditorFormData } from '@/modules/blog/components/BlogEditor';
import { blogService } from '@/modules/blog/services';

export function CreateBlogPage() {
  const router = useRouter();

  const handleSave = async (data: BlogEditorFormData, status: 'Draft' | 'Published') => {
    try {
      await blogService.createPost(data);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
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
