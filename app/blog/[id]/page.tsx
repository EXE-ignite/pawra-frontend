import React from 'react';
import { BlogDetailPage } from '@/modules/blog/pages/BlogDetailPage';
import { blogService } from '@/modules/blog/services/blog.service';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken')?.value;
    const post = await blogService.getPostById(id, authToken);
    const allPosts = await blogService.getLatestPosts(1, 10, authToken);
    const relatedPosts = allPosts.filter(p => p.id !== id).slice(0, 3);

    return <BlogDetailPage post={post} relatedPosts={relatedPosts} />;
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
