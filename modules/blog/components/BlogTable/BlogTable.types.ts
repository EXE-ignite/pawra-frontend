export interface BlogTablePost {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  category: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  date: string;
}

export interface BlogTableProps {
  posts: BlogTablePost[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onView: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}
