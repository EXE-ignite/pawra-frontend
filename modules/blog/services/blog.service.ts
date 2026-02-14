import { BlogPost, BlogCategory, BlogComment, BlogReaction } from '../types';
import type { BlogStats } from '../pages/AdminBlogPage/AdminBlogPage.types';
import type { BlogTablePost } from '../components/BlogTable/BlogTable.types';
import type { BlogEditorFormData } from '../components/BlogEditor/BlogEditor.types';

// Import all specialized services
import { blogPostService } from './blog-post.service';
import { blogCommentService } from './blog-comment.service';
import { blogReactionService } from './blog-reaction.service';
import { blogCategoryService } from './blog-category.service';
import { blogAdminService } from './blog-admin.service';

/**
 * Blog Service - Main Aggregator
 * 
 * This is the main service that aggregates all blog-related operations.
 * It delegates to specialized services for better code organization.
 * 
 * For direct access to specialized services, import them individually:
 * - blogPostService: Blog post CRUD operations
 * - blogCommentService: Comment operations  
 * - blogReactionService: Reaction operations
 * - blogCategoryService: Category operations
 * - blogAdminService: Admin operations
 */
class BlogService {
  // ===== BLOG POSTS =====
  
  async getBlogPosts(config?: any): Promise<BlogPost[]> {
    return blogPostService.getBlogPosts(config);
  }

  async getBlogPostById(id: string): Promise<BlogPost> {
    return blogPostService.getBlogPostById(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return blogPostService.getBlogPostBySlug(slug);
  }

  async getBlogPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    return blogPostService.getBlogPostsByAuthor(authorId);
  }

  async getBlogPostsByStatus(status: 'Published' | 'Draft'): Promise<BlogPost[]> {
    return blogPostService.getBlogPostsByStatus(status);
  }

  async getPublishedBlogPosts(params: { page?: number; pageSize?: number; categorySlug?: string }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    return blogPostService.getPublishedBlogPosts(params);
  }

  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return blogPostService.createBlogPost(data);
  }

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return blogPostService.updateBlogPost(id, data);
  }

  async deleteBlogPost(id: string): Promise<void> {
    return blogPostService.deleteBlogPost(id);
  }

  async publishBlogPost(id: string): Promise<BlogPost> {
    return blogPostService.publishBlogPost(id);
  }

  async unpublishBlogPost(id: string): Promise<BlogPost> {
    return blogPostService.unpublishBlogPost(id);
  }
  
  async getFeaturedPost(): Promise<BlogPost> {
    return blogPostService.getFeaturedPost();
  }

  async getFeaturedPosts(config?: any): Promise<BlogPost[]> {
    return blogPostService.getFeaturedPosts(config);
  }

  async getRelatedPosts(slug: string, limit: number = 3): Promise<BlogPost[]> {
    return blogPostService.getRelatedPosts(slug, limit);
  }

  async getLatestPosts(page = 1, limit = 10): Promise<BlogPost[]> {
    return blogPostService.getLatestPosts(page, limit);
  }

  async getPostById(id: string): Promise<BlogPost> {
    return blogPostService.getPostById(id);
  }

  async getPostsByCategory(category: string, page = 1, limit = 10): Promise<BlogPost[]> {
    return blogPostService.getPostsByCategory(category, page, limit);
  }

  async searchPosts(query: string, page = 1, limit = 10): Promise<BlogPost[]> {
    return blogPostService.searchPosts(query, page, limit);
  }

  // ===== BLOG CATEGORIES =====
  
  async getBlogCategories(): Promise<BlogCategory[]> {
    return blogCategoryService.getBlogCategories();
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory> {
    return blogCategoryService.getBlogCategoryBySlug(slug);
  }

  // ===== BLOG COMMENTS =====
  
  async getBlogPostComments(postId: string): Promise<BlogComment[]> {
    return blogCommentService.getBlogPostComments(postId);
  }

  async addBlogComment(postId: string, data: { content: string; parentId?: string }): Promise<BlogComment> {
    return blogCommentService.addBlogComment(postId, data);
  }

  async deleteComment(commentId: string): Promise<void> {
    return blogCommentService.deleteComment(commentId);
  }

  // ===== BLOG REACTIONS =====
  
  async getPostReactions(postId: string): Promise<BlogReaction[]> {
    return blogReactionService.getPostReactions(postId);
  }

  async toggleBlogReaction(postId: string, reaction: string): Promise<BlogReaction> {
    return blogReactionService.toggleBlogReaction(postId, reaction);
  }

  async getMyReactionsBatch(postIds: string[]): Promise<{ [postId: string]: string | null }> {
    return blogReactionService.getMyReactionsBatch(postIds);
  }

  // ===== ADMIN OPERATIONS =====

  async getAdminStats(config?: any): Promise<BlogStats> {
    return blogAdminService.getAdminStats(config);
  }

  async getAdminPosts(
    page = 1,
    limit = 10,
    search?: string,
    status?: 'Published' | 'Draft' | 'Scheduled',
    config?: any
  ): Promise<{ posts: BlogTablePost[]; total: number; totalPages: number }> {
    return blogAdminService.getAdminPosts(page, limit, search, status, config);
  }

  async deletePost(postId: string): Promise<void> {
    return blogAdminService.deletePost(postId);
  }

  async createPost(data: BlogEditorFormData): Promise<BlogPost> {
    return blogAdminService.createPost(data);
  }

  async updatePost(postId: string, data: BlogEditorFormData): Promise<BlogPost> {
    return blogAdminService.updatePost(postId, data);
  }
}

export const blogService = new BlogService();
