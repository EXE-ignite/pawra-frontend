import { apiService } from '@/modules/shared/services';
import { BlogCategory } from '../types';
import { USE_MOCK } from './helpers';

/**
 * Blog Category Service
 * Handles all blog category-related operations
 */
class BlogCategoryService {
  private readonly categoryEndpoint = '/BlogCategories';

  async getBlogCategories(): Promise<BlogCategory[]> {
    if (USE_MOCK) {
      return [
        'health', 'nutrition', 'training', 'behavior', 'grooming',
      ];
    }
    const res = await apiService.get<BlogCategory[]>(`${this.categoryEndpoint}`);
    return res.data;
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory> {
    if (USE_MOCK) {
      return 'health';
    }
    const res = await apiService.get<BlogCategory>(`${this.categoryEndpoint}/${slug}`);
    return res.data;
  }
}

export const blogCategoryService = new BlogCategoryService();
