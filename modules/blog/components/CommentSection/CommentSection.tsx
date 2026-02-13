'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { blogService } from '@/modules/blog/services';
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
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
            name: comment.author.name,
            avatar: comment.author.avatarUrl || comment.author.name.charAt(0).toUpperCase(),
            role: undefined, // Backend might provide role
          },
          content: comment.content,
          createdAt: formatRelativeTime(comment.createdAt),
          replies: comment.replies?.map(reply => ({
            id: reply.id,
            author: {
              name: reply.author.name,
              avatar: reply.author.avatarUrl || reply.author.name.charAt(0).toUpperCase(),
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

    setSubmitting(true);
    try {
      const addedComment = await blogService.addBlogComment(postId, {
        content: newComment.trim(),
      });
      
      // Add new comment to list
      const newCommentUI: Comment = {
        id: addedComment.id,
        author: {
          name: addedComment.author.name,
          avatar: addedComment.author.avatarUrl || addedComment.author.name.charAt(0).toUpperCase(),
        },
        content: addedComment.content,
        createdAt: formatRelativeTime(addedComment.createdAt),
      };
      
      setComments(prev => [...prev, newCommentUI]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      // Optionally show error toast to user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.title}>
        Comments ({loading ? '...' : comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.avatarPlaceholder}>
          <span>👤</span>
        </div>
        <div className={styles.formContent}>
          <textarea 
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.textarea}
            rows={4}
            disabled={submitting}
          />
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!newComment.trim() || submitting}
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
                <button className={styles.replyBtn}>Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
