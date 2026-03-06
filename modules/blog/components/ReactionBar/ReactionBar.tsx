'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { blogService } from '@/modules/blog/services';
import { useAuth } from '@/modules/shared/contexts';
import { ReactionBarProps, Reaction, ReactionType } from './ReactionBar.types';
import styles from './ReactionBar.module.scss';

const reactionConfig: Reaction[] = [
  { type: 'like',  emoji: '👍', label: 'Like',  count: 0 },
  { type: 'love',  emoji: '❤️', label: 'Love',  count: 0 },
  { type: 'haha',  emoji: '😂', label: 'Haha',  count: 0 },
  { type: 'wow',   emoji: '😮', label: 'Wow',   count: 0 },
  { type: 'sad',   emoji: '😢', label: 'Sad',   count: 0 },
  { type: 'angry', emoji: '😡', label: 'Angry', count: 0 },
];

export function ReactionBar({ postId, initialReactions }: ReactionBarProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(() => {
    if (initialReactions && initialReactions.length > 0) {
      // Merge initial counts with config
      return reactionConfig.map(config => {
        const found = initialReactions.find(r => r.type === config.type);
        return { ...config, count: found?.count || 0 };
      });
    }
    return reactionConfig;
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginHint, setLoginHint] = useState(false);

  const syncFromApi = useCallback(async () => {
    try {
      const apiReactions = await blogService.getPostReactions(postId);
      const mappedReactions = reactionConfig.map(config => {
        const apiReaction = apiReactions.find(r => r.reaction === config.type);
        // BE only returns reaction types with count > 0 — fall back to initialReactions
        // (sourced from post's reactionSummary) for types not in the response
        const fallbackCount = initialReactions?.find(r => r.type === config.type)?.count ?? 0;
        return { ...config, count: apiReaction?.count ?? fallbackCount };
      });
      setReactions(mappedReactions);
      const userReacted = apiReactions.find(r => r.reacted);
      setUserReaction(userReacted ? (userReacted.reaction as ReactionType) : null);
    } catch (error) {
      console.error('Failed to load reactions:', error);
    }
  }, [postId, initialReactions]);

  // Load reactions on mount
  useEffect(() => {
    syncFromApi();
  }, [syncFromApi]);

  const handleReaction = async (type: ReactionType) => {
    if (loading) return;

    // Require login — don't block if auth is still being determined
    if (!authLoading && !isAuthenticated) {
      setLoginHint(true);
      setTimeout(() => setLoginHint(false), 3000);
      return;
    }

    // Optimistic update
    const prevReaction = userReaction;
    const isRemoving = userReaction === type;
    setUserReaction(isRemoving ? null : type);
    setReactions(prev =>
      prev.map(r => {
        if (r.type === type) return { ...r, count: r.count + (isRemoving ? -1 : 1) };
        if (r.type === prevReaction && !isRemoving) return { ...r, count: Math.max(0, r.count - 1) };
        return r;
      })
    );

    setLoading(true);
    try {
      await blogService.toggleBlogReaction(postId, type);
      // Always re-fetch real counts from server after toggle
      await syncFromApi();
    } catch (error) {
      // Rollback optimistic update on failure
      setUserReaction(prevReaction);
      await syncFromApi();
      console.error('Failed to toggle reaction:', error);
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

      {loginHint && (
        <p className={styles.loginHint}>🔒 Vui lòng đăng nhập để react bài viết.</p>
      )}
      
      <div className={styles.reactions}>
        {reactions.map((reaction) => (
          <button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type)}
            disabled={loading || authLoading}
            className={`${styles.reactionBtn} ${
              userReaction === reaction.type ? styles.active : ''
            } ${loading || authLoading ? styles.loading : ''}`}
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
