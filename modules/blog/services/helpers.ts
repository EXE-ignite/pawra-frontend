/**
 * Helper functions for blog services
 */

export const USE_MOCK = false; // Backend đã implement đầy đủ endpoints
export const USE_MOCK_ADMIN = false; // Backend đã implement admin endpoints

/**
 * Map numeric status to string
 */
export function mapStatus(status: number | string): 'Published' | 'Draft' | 'Scheduled' {
  if (typeof status === 'number') {
    return status === 1 ? 'Published' : 'Draft';
  }
  return status as 'Published' | 'Draft' | 'Scheduled';
}

/**
 * Convert string status to numeric for backend
 */
export function mapStatusToNumber(status: 'Published' | 'Draft' | 'Scheduled'): number {
  return status === 'Published' ? 1 : 0;
}

/**
 * Transform blog post data from backend to frontend format
 */
export function transformPostData(postData: any): any {
  postData.imageUrl = postData.imageUrl || postData.thumbnailUrl || '';
  postData.publishedAt = postData.publishedAt || postData.publishedDate || new Date().toISOString();
  postData.category = postData.category || (postData.categories && postData.categories[0]) || 'health';
  postData.readTime = postData.readTime || 5;
  postData.excerpt = postData.excerpt || '';
  postData.content = postData.content || '';
  
  if (postData.author) {
    postData.author.avatar = postData.author.avatar || postData.author.avatarUrl || '';
    postData.author.name = postData.author.name || 'Unknown Author';
  } else {
    postData.author = { name: 'Unknown Author', avatar: '' };
  }
  
  if (typeof postData.status === 'number') {
    postData.status = mapStatus(postData.status);
  }
  
  return postData;
}
