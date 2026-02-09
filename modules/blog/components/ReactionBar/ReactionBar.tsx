'use client';

import React, { useState } from 'react';
import { ReactionBarProps, Reaction, ReactionType } from './ReactionBar.types';
import styles from './ReactionBar.module.scss';

const defaultReactions: Reaction[] = [
  { type: 'like', emoji: '👍', label: 'Like', count: 24 },
  { type: 'love', emoji: '❤️', label: 'Love', count: 18 },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate', count: 12 },
  { type: 'insightful', emoji: '💡', label: 'Insightful', count: 9 },
  { type: 'curious', emoji: '🤔', label: 'Curious', count: 5 }
];

export function ReactionBar({ postId, initialReactions = defaultReactions }: ReactionBarProps) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);

  const handleReaction = (type: ReactionType) => {
    setReactions(prevReactions =>
      prevReactions.map(reaction => {
        if (reaction.type === type) {
          // If clicking same reaction, remove it
          if (userReaction === type) {
            return { ...reaction, count: Math.max(0, reaction.count - 1) };
          }
          // Otherwise add new reaction
          return { ...reaction, count: reaction.count + 1 };
        }
        // Remove previous reaction if any
        if (reaction.type === userReaction) {
          return { ...reaction, count: Math.max(0, reaction.count - 1) };
        }
        return reaction;
      })
    );

    // Toggle user reaction
    setUserReaction(prev => prev === type ? null : type);
  };

  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className={styles.reactionBar}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          <span className={styles.icon}>👋</span>
          How did you find this article?
        </h4>
        {totalReactions > 0 && (
          <span className={styles.totalCount}>{totalReactions} reactions</span>
        )}
      </div>
      
      <div className={styles.reactions}>
        {reactions.map((reaction) => (
          <button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type)}
            className={`${styles.reactionBtn} ${
              userReaction === reaction.type ? styles.active : ''
            }`}
            aria-label={`React with ${reaction.label}`}
          >
            <span className={styles.emoji}>{reaction.emoji}</span>
            <span className={styles.label}>{reaction.label}</span>
            {reaction.count > 0 && (
              <span className={styles.count}>{reaction.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
