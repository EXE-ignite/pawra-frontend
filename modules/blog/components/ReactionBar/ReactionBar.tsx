'use client';

import React, { useState, useEffect } from 'react';
import { blogService } from '@/modules/blog/services';
import { ReactionBarProps, Reaction, ReactionType } from './ReactionBar.types';
import styles from './ReactionBar.module.scss';

const reactionConfig: Reaction[] = [
  { type: 'like', emoji: '👍', label: 'Like', count: 0 },
  { type: 'love', emoji: '❤️', label: 'Love', count: 0 },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate', count: 0 },
  { type: 'insightful', emoji: '💡', label: 'Insightful', count: 0 },
  { type: 'curious', emoji: '🤔', label: 'Curious', count: 0 }
];

export function ReactionBar({ postId }: ReactionBarProps) {
  const [reactions, setReactions] = useState<Reaction[]>(reactionConfig);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);

  // Load reactions on mount
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const apiReactions = await blogService.getPostReactions(postId);
        
        // Map API reactions to UI format
        const mappedReactions = reactionConfig.map(config => {
          const apiReaction = apiReactions.find(r => r.reaction === config.type);
          return {
            ...config,
            count: apiReaction?.count || 0,
          };
        });
        
        setReactions(mappedReactions);
        
        // Set user's reaction if any
        const userReacted = apiReactions.find(r => r.reacted);
        if (userReacted) {
          setUserReaction(userReacted.reaction as ReactionType);
        }
      } catch (error) {
        console.error('Failed to load reactions:', error);
        // Keep default reactions on error
      }
    };

    loadReactions();
  }, [postId]);

  const handleReaction = async (type: ReactionType) => {
    if (loading) return;

    setLoading(true);
    try {
      // Call API to toggle reaction
      const result = await blogService.toggleBlogReaction(postId, type);
      
      // Update local state based on API response
      setReactions(prevReactions =>
        prevReactions.map(reaction => {
          if (reaction.type === type) {
            return { ...reaction, count: result.count };
          }
          return reaction;
        })
      );

      // Update user reaction state
      setUserReaction(result.reacted ? type : null);
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
      // Optionally show error toast to user
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className={`${styles.reactionBtn} ${
              userReaction === reaction.type ? styles.active : ''
            } ${loading ? styles.loading : ''}`}
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
