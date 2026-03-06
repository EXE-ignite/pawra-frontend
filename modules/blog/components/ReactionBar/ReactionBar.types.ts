export type ReactionType = 'like' | 'love' | 'haha' | 'angry' | 'sad' | 'wow';

// Maps ReactionType to BE UUID
export const REACTION_TYPE_IDS: Record<ReactionType, string> = {
  like:  '9D34726A-4D87-4154-A01C-C94D09B3A450',
  love:  '6F3BD810-6C62-4328-8730-26C496FA4EFB',
  haha:  'C89B5834-F16A-4AF4-86C6-2E9796296124',
  angry: 'FBC01CBB-2836-48CE-B6DD-E43C05399751',
  sad:   '37931634-3641-4160-9A8D-3729D273108C',
  wow:   '0C04BB1B-3862-4D51-BEDC-DFCC4AC516C2',
};

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
