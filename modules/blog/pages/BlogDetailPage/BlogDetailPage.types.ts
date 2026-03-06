import { BlogPost } from '../../types';

export interface BlogDetailPageProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface RelatedPostsProps {
  posts: BlogPost[];
}
