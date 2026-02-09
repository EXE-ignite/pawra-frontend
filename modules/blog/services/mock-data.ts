import { BlogPost } from '../types';

export const mockBlogData = {
  featuredPost: {
    id: '1',
    title: '10 Essential Tips for New Puppy Owners',
    excerpt: 'Master the basics of puppy care from nutrition to early socialization. Your journey to raising a happy, healthy best friend starts here.',
    content: '',
    category: 'training' as const,
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
    readTime: 8,
    publishedAt: '2 days ago',
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: '/images/authors/sarah.jpg'
    },
    isFeatured: true
  },

  latestPosts: [
    {
      id: '2',
      title: "Understanding Your Cat's Body Language",
      excerpt: "Ever wonder what that tail flick means? Learn how to speak cat...",
      content: '',
      category: 'behavior' as const,
      imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=240&fit=crop',
      readTime: 5,
      publishedAt: '3 days ago',
      author: {
        name: 'Emily Chen',
        avatar: '/images/authors/emily.jpg'
      }
    },
    {
      id: '3',
      title: 'The Raw Food Diet: Is It Right for Your Dog?',
      excerpt: 'We break down the pros and cons of raw feeding to help you make an...',
      content: '',
      category: 'nutrition' as const,
      imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=240&fit=crop',
      readTime: 12,
      publishedAt: '5 days ago',
      author: {
        name: 'Dr. Mike Wilson',
        avatar: '/images/authors/mike.jpg'
      }
    },
    {
      id: '4',
      title: 'Stress-Free Bath Time Secrets',
      excerpt: 'Turn the dreaded bath day into a bonding experience with these...',
      content: '',
      category: 'grooming' as const,
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=240&fit=crop',
      readTime: 6,
      publishedAt: '1 week ago',
      author: {
        name: 'Lisa Park',
        avatar: '/images/authors/lisa.jpg'
      }
    },
    {
      id: '5',
      title: 'Common Summer Allergies in Pugs',
      excerpt: 'Keep your snort-nosed friends breathing easy and itch-free dur...',
      content: '',
      category: 'health' as const,
      imageUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=400&h=240&fit=crop',
      readTime: 9,
      publishedAt: '1 week ago',
      author: {
        name: 'Dr. Sarah Johnson',
        avatar: '/images/authors/sarah.jpg'
      }
    }
  ] as BlogPost[]
};
