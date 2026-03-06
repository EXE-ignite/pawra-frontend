import { notFound } from 'next/navigation';
import { blogService } from '@/modules/blog/services';
import { EditBlogPage } from '@/modules/blog/pages/EditBlogPage';
import type { BlogEditorFormData } from '@/modules/blog/components/BlogEditor';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const post = await blogService.getPostById(id);
    
    const initialData: BlogEditorFormData = {
      title: post.title,
      slug: post.slug || post.id,
      content: post.content,
      excerpt: post.excerpt,
      thumbnailUrl: post.imageUrl,
      categoryId: post.category,
      status: 'Published', // TODO: Get from post.status
    };

    return <EditBlogPage postId={id} initialData={initialData} />;
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}
