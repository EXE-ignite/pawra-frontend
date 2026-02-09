/**
 * API Response Examples for Backend Integration
 * 
 * All responses should follow the ApiResponse<T> format:
 * {
 *   data: T,
 *   message?: string,
 *   success: boolean
 * }
 */

// ============================================
// GET /blog/featured
// ============================================
const getFeaturedPostResponse = {
  success: true,
  message: "Featured post retrieved successfully",
  data: {
    id: "1",
    title: "10 Essential Tips for New Puppy Owners",
    excerpt: "Master the basics of puppy care from nutrition to early socialization.",
    content: "<p>Full HTML content here...</p>",
    category: "training",
    imageUrl: "https://example.com/images/puppy.jpg",
    readTime: 8,
    publishedAt: "2024-02-07T10:30:00Z", // ISO 8601 format
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "https://example.com/avatars/sarah.jpg"
    },
    isFeatured: true
  }
};

// ============================================
// GET /blog/posts?page=1&limit=10
// ============================================
const getLatestPostsResponse = {
  success: true,
  message: "Posts retrieved successfully",
  data: [
    {
      id: "2",
      title: "Understanding Your Cat's Body Language",
      excerpt: "Ever wonder what that tail flick means?",
      content: "<p>Full HTML content here...</p>",
      category: "behavior",
      imageUrl: "https://example.com/images/cat.jpg",
      readTime: 5,
      publishedAt: "2024-02-06T14:20:00Z",
      author: {
        name: "Emily Chen",
        avatar: "https://example.com/avatars/emily.jpg"
      }
    }
    // ... more posts
  ]
};

// ============================================
// GET /blog/posts/:id
// ============================================
const getPostByIdResponse = {
  success: true,
  message: "Post retrieved successfully",
  data: {
    id: "2",
    title: "Understanding Your Cat's Body Language",
    excerpt: "Ever wonder what that tail flick means?",
    content: "<p>Full HTML content here...</p>",
    category: "behavior",
    imageUrl: "https://example.com/images/cat.jpg",
    readTime: 5,
    publishedAt: "2024-02-06T14:20:00Z",
    author: {
      name: "Emily Chen",
      avatar: "https://example.com/avatars/emily.jpg"
    }
  }
};

// ============================================
// GET /blog/posts?category=health&page=1&limit=10
// ============================================
const getPostsByCategoryResponse = {
  success: true,
  message: "Posts retrieved successfully",
  data: [
    {
      id: "5",
      title: "Common Summer Allergies in Pugs",
      excerpt: "Keep your snort-nosed friends breathing easy...",
      content: "<p>Full HTML content here...</p>",
      category: "health",
      imageUrl: "https://example.com/images/pug.jpg",
      readTime: 9,
      publishedAt: "2024-02-01T09:15:00Z",
      author: {
        name: "Dr. Sarah Johnson",
        avatar: "https://example.com/avatars/sarah.jpg"
      }
    }
    // ... more health posts
  ]
};

// ============================================
// GET /blog/posts/search?q=puppy&page=1&limit=10
// ============================================
const searchPostsResponse = {
  success: true,
  message: "Search completed successfully",
  data: [
    {
      id: "1",
      title: "10 Essential Tips for New Puppy Owners",
      excerpt: "Master the basics of puppy care...",
      content: "<p>Full HTML content here...</p>",
      category: "training",
      imageUrl: "https://example.com/images/puppy.jpg",
      readTime: 8,
      publishedAt: "2024-02-07T10:30:00Z",
      author: {
        name: "Dr. Sarah Johnson",
        avatar: "https://example.com/avatars/sarah.jpg"
      },
      isFeatured: true
    }
    // ... more matching posts
  ]
};

// ============================================
// ERROR RESPONSES
// ============================================

// 404 - Post not found
const notFoundResponse = {
  success: false,
  message: "Post not found",
  data: null
};

// 400 - Invalid parameters
const badRequestResponse = {
  success: false,
  message: "Invalid query parameters",
  data: null
};

// 500 - Server error
const serverErrorResponse = {
  success: false,
  message: "Internal server error",
  data: null
};

// ============================================
// VALIDATION RULES
// ============================================

/**
 * Category must be one of:
 * - health
 * - nutrition
 * - training
 * - behavior
 * - grooming
 * 
 * Pagination:
 * - page: positive integer (default: 1)
 * - limit: 1-100 (default: 10)
 * 
 * Search:
 * - q: string, min 2 characters
 * 
 * Dates:
 * - Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
 * - Or return relative time strings ("2 days ago", "1 week ago")
 */

export {};
