'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { blogService } from '@/modules/blog/services';
import { useAuth } from '@/modules/shared/contexts';
import { AuthModal } from '@/modules/shared/components';
import { CommentSectionProps, Comment } from './CommentSection.types';
import styles from './CommentSection.module.scss';

// Helper to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Helper to check if avatar is URL
const isAvatarUrl = (avatar?: string): boolean => {
  if (!avatar) return false;
  return avatar.startsWith('http://') || avatar.startsWith('https://');
};

export function CommentSection({ postId }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState(false);

  // Load comments on mount
  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const apiComments = await blogService.getBlogPostComments(postId);
        
        // Map API comments to UI format
        const mappedComments: Comment[] = apiComments.map(comment => ({
          id: comment.id,
          author: {
            name: comment.author?.name || 'Anonymous',
            avatar: comment.author?.avatarUrl || (comment.author?.name?.charAt(0).toUpperCase() ?? '?'),
            role: undefined,
          },
          content: comment.content,
          createdAt: formatRelativeTime(comment.createdAt),
          replies: comment.replies?.map(reply => ({
            id: reply.id,
            author: {
              name: reply.author?.name || 'Anonymous',
              avatar: reply.author?.avatarUrl || (reply.author?.name?.charAt(0).toUpperCase() ?? '?'),
            },
            content: reply.content,
            createdAt: formatRelativeTime(reply.createdAt),
          })),
        }));
        
        setComments(mappedComments);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const addedComment = await blogService.addBlogComment(postId, {
        content: newComment.trim(),
      });

      // BE may return null on success (e.g. 201 with no body) — build fallback from known data
      const newCommentUI: Comment = addedComment
        ? {
            id: addedComment.id,
            author: {
              name: addedComment.author?.name || 'You',
              avatar: addedComment.author?.avatarUrl || (addedComment.author?.name?.charAt(0).toUpperCase() ?? 'Y'),
            },
            content: addedComment.content,
            createdAt: formatRelativeTime(addedComment.createdAt),
          }
        : {
            id: `temp-${Date.now()}`,
            author: { name: 'You', avatar: 'Y' },
            content: newComment.trim(),
            createdAt: 'Just now',
          };

      setComments(prev => [...prev, newCommentUI]);
      setNewComment('');
    } catch (error: any) {
      console.error('Failed to post comment:', error);
      // Show user-friendly error message
      const errorMessage = error?.message || 'Failed to post comment. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    const content = replyContent[parentId]?.trim();
    if (!content || submittingReply) return;

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setSubmittingReply(true);
    try {
      const added = await blogService.addBlogComment(postId, { content, parentId });

      const newReply: Comment = added
        ? {
            id: added.id,
            author: {
              name: added.author?.name || 'You',
              avatar: added.author?.avatarUrl || (added.author?.name?.charAt(0).toUpperCase() ?? 'Y'),
            },
            content: added.content,
            createdAt: formatRelativeTime(added.createdAt),
          }
        : {
            id: `temp-reply-${Date.now()}`,
            author: { name: 'You', avatar: 'Y' },
            content,
            createdAt: 'Just now',
          };

      setComments(prev =>
        prev.map(c =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      );
      setReplyContent(prev => ({ ...prev, [parentId]: '' }));
      setReplyingTo(null);
    } catch (error: any) {
      console.error('Failed to post reply:', error);
      alert(error?.message || 'Failed to post reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className={styles.commentSection}>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
      <h3 className={styles.title}>
        Comments ({loading ? '...' : comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.avatarPlaceholder}>
          <span>{isAuthenticated && user ? (user.fullName?.charAt(0).toUpperCase() ?? '👤') : '👤'}</span>
        </div>
        <div className={styles.formContent}>
          <textarea 
            placeholder={isAuthenticated ? 'Add a comment...' : '🔒 Đăng nhập để bình luận...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.textarea}
            rows={4}
            disabled={submitting || !isAuthenticated}
          />
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!newComment.trim() || submitting || !isAuthenticated}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className={styles.loading}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>
                {isAvatarUrl(comment.author.avatar) ? (
                  <Image
                    src={comment.author.avatar!}
                    alt={comment.author.name}
                    width={40}
                    height={40}
                    className={styles.avatarImage}
                  />
                ) : (
                  <span>{comment.author.avatar}</span>
                )}
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <div className={styles.authorName}>
                    {comment.author.name}
                    {comment.author.role && (
                      <span className={styles.authorRole}>{comment.author.role}</span>
                    )}
                  </div>
                  <span className={styles.commentTime}>{comment.createdAt}</span>
                </div>
                <p className={styles.commentText}>{comment.content}</p>
                <button
                  className={styles.replyBtn}
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                </button>

                {/* Inline reply form */}
                {replyingTo === comment.id && (
                  <div className={styles.replyForm}>
                    <textarea
                      placeholder={`Reply to ${comment.author.name}...`}
                      value={replyContent[comment.id] || ''}
                      onChange={e =>
                        setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      className={styles.replyTextarea}
                      rows={3}
                      disabled={submittingReply}
                      autoFocus
                    />
                    <div className={styles.replyFormActions}>
                      <button
                        className={styles.cancelReplyBtn}
                        onClick={() => setReplyingTo(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className={styles.submitReplyBtn}
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyContent[comment.id]?.trim() || submittingReply}
                        type="button"
                      >
                        {submittingReply ? 'Posting...' : 'Post Reply'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className={styles.replies}>
                    {comment.replies.map(reply => (
                      <div key={reply.id} className={styles.reply}>
                        <div className={styles.replyAvatar}>
                          {isAvatarUrl(reply.author.avatar) ? (
                            <Image
                              src={reply.author.avatar!}
                              alt={reply.author.name}
                              width={32}
                              height={32}
                              className={styles.avatarImage}
                            />
                          ) : (
                            <span>{reply.author.avatar}</span>
                          )}
                        </div>
                        <div className={styles.commentContent}>
                          <div className={styles.commentHeader}>
                            <span className={styles.authorName}>{reply.author.name}</span>
                            <span className={styles.commentTime}>{reply.createdAt}</span>
                          </div>
                          <p className={styles.commentText}>{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
