'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor, BlogEditorFormData } from '@/modules/blog/components/BlogEditor';
import { blogService } from '@/modules/blog/services';

interface EditBlogPageProps {
  postId: string;
  initialData: BlogEditorFormData;
}

export function EditBlogPage({ postId, initialData }: EditBlogPageProps) {
  const router = useRouter();

  const handleSave = async (data: BlogEditorFormData, status: 'Draft' | 'Published') => {
    try {
      await blogService.updatePost(postId, data);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  return (
    <BlogEditor
      mode="edit"
      postId={postId}
      initialData={initialData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
