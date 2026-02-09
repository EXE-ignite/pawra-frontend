import React from 'react';
import { MainLayout } from '@/modules/shared/layouts/MainLayout';
import { BlogPage } from '@/modules/blog/pages/BlogPage';
import { blogService } from '@/modules/blog/services/blog.service';

export default async function Blog() {
  const featuredPost = await blogService.getFeaturedPost();
  const latestPosts = await blogService.getLatestPosts();

  return (
    <MainLayout>
      <BlogPage featuredPost={featuredPost} latestPosts={latestPosts} />
    </MainLayout>
  );
}
