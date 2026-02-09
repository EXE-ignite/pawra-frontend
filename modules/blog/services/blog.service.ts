import { apiService } from '@/modules/shared/services';
import { BlogPost } from '../types';
import { mockBlogData } from './mock-data';

/**
 * Blog Service - API Ready
 * 
 * To switch from mock data to real API:
 * 1. Set USE_MOCK = false
 * 2. Ensure .env.local has NEXT_PUBLIC_API_URL configured
 * 3. Backend must implement endpoints documented in README.md
 */
const USE_MOCK = true; // TODO: Set to false when API is ready

class BlogService {
  private readonly endpoint = '/blog';

  async getFeaturedPost(): Promise<BlogPost> {
    if (USE_MOCK) {
      return mockBlogData.featuredPost;
    }

    try {
      const response = await apiService.get<BlogPost>(`${this.endpoint}/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured post:', error);
      throw error;
    }
  }

  async getLatestPosts(page = 1, limit = 10): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts;
    }

    try {
      const response = await apiService.get<BlogPost[]>(
        `${this.endpoint}/posts?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      throw error;
    }
  }

  async getPostById(id: string): Promise<BlogPost> {
    if (USE_MOCK) {
      const allPosts = [mockBlogData.featuredPost, ...mockBlogData.latestPosts];
      const post = allPosts.find(p => p.id === id);
      if (!post) throw new Error('Post not found');
      
      // Add full content for detail page
      return {
        ...post,
        content: `
          <p>Switching your cat's food can be a delicate process. Cats are notoriously sensitive to changes in their environment, and their digestive systems are no exception.</p>
          
          <p>Changing a cat's food too quickly can lead to gastrointestinal upset, including vomiting or diarrhea. Furthermore, some cats may simply refuse to eat the new food, which can be dangerous for their health. A slow and steady approach is the key to a successful transition.</p>
          
          <h2>The 7-Day Transition Schedule</h2>
          
          <p>Veterinarians generally recommend a 7-day transition period. This allows the beneficial bacteria in your cat's gut to adjust to the new ingredients. Here's a recommended breakdown:</p>
          
          <ul>
            <li><strong>Days 1-2:</strong> 75% old food, 25% new food.</li>
            <li><strong>Days 3-4:</strong> 50% old food, 50% new food.</li>
            <li><strong>Days 5-6:</strong> 25% old food, 75% new food.</li>
            <li><strong>Day 7:</strong> 100% new food.</li>
          </ul>
          
          <div class="pro-tip">
            <h4>💡 Pro-Tip</h4>
            <p>If your cat is particularly picky, you can extend this schedule to 14 days, increasing the new food in 10% increments every day or two.</p>
          </div>
          
          <h2>Monitoring Your Cat</h2>
          
          <p>During the transition, keep a close eye on your cat's behavior and litter box habits. Look for any signs of discomfort or refusal to eat. If your cat stops eating for more than 24 hours, contact your vet immediately, as this can lead to Hepatic Lipidosis.</p>
        `
      };
    }

    try {
      const response = await apiService.get<BlogPost>(`${this.endpoint}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  async getPostsByCategory(category: string, page = 1, limit = 10): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.filter(p => p.category === category);
    }

    try {
      const response = await apiService.get<BlogPost[]>(
        `${this.endpoint}/posts?category=${category}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      throw error;
    }
  }

  async searchPosts(query: string, page = 1, limit = 10): Promise<BlogPost[]> {
    if (USE_MOCK) {
      return mockBlogData.latestPosts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await apiService.get<BlogPost[]>(
        `${this.endpoint}/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();
