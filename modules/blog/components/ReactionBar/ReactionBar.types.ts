export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful' | 'curious';

export interface Reaction {
  type: ReactionType;
  emoji: string;
  label: string;
  count: number;
}

export interface ReactionBarProps {
  postId: string;
  initialReactions?: Reaction[];
}
