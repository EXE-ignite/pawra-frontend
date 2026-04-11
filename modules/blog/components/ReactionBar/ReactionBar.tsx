'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { blogService } from '@/modules/blog/services';
import { useAuth } from '@/modules/shared/contexts';
import { AuthModal } from '@/modules/shared/components';
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Stable ref — updated once on mount so syncFromApi never re-creates due to prop changes
  const initialReactionsRef = useRef(initialReactions);

  const syncFromApi = useCallback(async () => {
    try {
      const apiReactions = await blogService.getPostReactions(postId);
      const mappedReactions = reactionConfig.map(config => {
        const apiReaction = apiReactions.find(r => r.reaction === config.type);
        // BE only returns reaction types with count > 0 — fall back to 0 for missing types
        const fallbackCount = initialReactionsRef.current?.find(r => r.type === config.type)?.count ?? 0;
        return { ...config, count: apiReaction?.count ?? fallbackCount };
      });
      setReactions(mappedReactions);
      const userReacted = apiReactions.find(r => r.reacted);
      setUserReaction(userReacted ? (userReacted.reaction as ReactionType) : null);
    } catch (error) {
      console.error('Failed to load reactions:', error);
    }
  }, [postId]); // ✅ No initialReactions dep — uses stable ref to prevent infinite re-fetch loop

  // Load reactions on mount
  useEffect(() => {
    syncFromApi();
  }, [syncFromApi]);

  // Re-fetch when auth state resolves so user's existing reaction is highlighted
  useEffect(() => {
    if (!authLoading) {
      syncFromApi();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const handleReaction = async (type: ReactionType) => {
    if (loading) return;

    // Require login — don't block if auth is still being determined
    if (!authLoading && !isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optimistic update
    const prevReaction = userReaction;
    const prevReactions = reactions;
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
      // ✅ Keep optimistic update — don't call syncFromApi() here as it may return
      // stale cached counts and overwrite the change the user just made
    } catch (error) {
      // Rollback optimistic update on failure
      setUserReaction(prevReaction);
      setReactions(prevReactions);
      console.error('Failed to toggle reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className={styles.reactionBar}>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
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
