# Blog Module - API Integration Guide

## Current Status
✅ **Ready for API Integration**

The blog module is currently using mock data but is fully structured and ready to connect to a real API.

## Structure

```
modules/blog/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── services/           # API service layer
│   ├── blog.service.ts    # Main service (API-ready)
│   └── mock-data.ts       # Mock data (temporary)
├── types/              # TypeScript definitions
│   ├── blog.types.ts      # Core data types
│   └── api.types.ts       # API response types
```

## How to Switch to Real API

### 1. Update API Endpoint
In `modules/blog/services/blog.service.ts`, set:
```typescript
const USE_MOCK = false; // Change from true to false
```

### 2. Configure API Base URL
Ensure your `.env.local` has:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 3. Expected API Endpoints

The service expects these endpoints:

#### Get Featured Post
```
GET /blog/featured
Response: BlogPost
```

#### Get Latest Posts (with pagination)
```
GET /blog/posts?page=1&limit=10
Response: BlogPost[]
```

#### Get Post by ID
```
GET /blog/posts/:id
Response: BlogPost
```

#### Get Posts by Category
```
GET /blog/posts?category=health&page=1&limit=10
Response: BlogPost[]
```

#### Search Posts
```
GET /blog/posts/search?q=keyword&page=1&limit=10
Response: BlogPost[]
```

### 4. Expected Response Format

All responses should follow this structure (already handled by `apiService`):
```typescript
{
  data: T,          // Your actual data (BlogPost or BlogPost[])
  message?: string,
  success: boolean
}
```

### 5. Data Types

Ensure your API returns data matching these TypeScript types:

```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'health' | 'nutrition' | 'training' | 'behavior' | 'grooming';
  imageUrl: string;
  readTime: number;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  isFeatured?: boolean;
}
```

## Features Already Implemented

✅ Service layer with proper error handling
✅ Type-safe API calls
✅ Pagination support
✅ Category filtering
✅ Search functionality
✅ Mock data for development
✅ Easy toggle between mock/real API

## Adding New API Methods

To add new API methods, follow this pattern in `blog.service.ts`:

```typescript
async getRelatedPosts(postId: string): Promise<BlogPost[]> {
  if (USE_MOCK) {
    // Return mock data
    return mockBlogData.latestPosts.slice(0, 3);
  }

  try {
    const response = await apiService.get<BlogPost[]>(
      `${this.endpoint}/posts/${postId}/related`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw error;
  }
}
```

## Error Handling

All API errors are:
1. Caught in the service layer
2. Logged to console
3. Re-thrown for component-level handling
4. Intercepted by `apiService` for common errors (auth, network, etc.)

## Testing

While in mock mode (`USE_MOCK = true`), you can:
- Test all UI components
- Test loading states
- Test error states
- Develop without backend dependency

## Next Steps

1. Backend team implements the endpoints listed above
2. Update `USE_MOCK` to `false`
3. Test with real API
4. Add loading/error states to components if needed
5. Remove mock-data.ts file (optional)
