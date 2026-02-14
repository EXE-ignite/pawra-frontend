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
    } catch (error: any) {
      console.error('Error updating post:', error);
      const errorMessage = error?.message || error?.errors 
        ? Object.values(error.errors)[0]?.[0] 
        : 'Failed to update post';
      alert(`Failed to update post: ${errorMessage}`);
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
