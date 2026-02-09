'use client';

import React, { useState } from 'react';
import { CommentSectionProps, Comment } from './CommentSection.types';
import styles from './CommentSection.module.scss';

// Mock comments - replace with API call
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Mark Thompson',
      avatar: 'M'
    },
    content: "This was incredibly helpful! My Maine Coon is so picky and usually gets an upset stomach when we switch brands. I'll try the 14 day schedule you suggested.",
    createdAt: '3 hours ago'
  },
  {
    id: '2',
    author: {
      name: 'Dr. Sarah Wilson',
      avatar: 'S',
      role: 'Author'
    },
    content: "Glad you found it useful, Mark! Maine Coons can definitely be sensitive. Keep me updated on how he does!",
    createdAt: '1 hour ago'
  }
];

export function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [comments] = useState<Comment[]>(mockComments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit comment to API
    console.log('Posting comment:', newComment);
    setNewComment('');
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.title}>Comments ({comments.length})</h3>

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
          />
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentAvatar}>
              {comment.author.avatar}
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
    </div>
  );
}
