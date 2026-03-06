export interface CommentSectionProps {
  postId: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  createdAt: string;
  replies?: Comment[];
}
