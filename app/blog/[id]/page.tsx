import React from 'react';
import { BlogDetailPage } from '@/modules/blog/pages/BlogDetailPage';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { id } = await params;
  return <BlogDetailPage id={id} />;
}
