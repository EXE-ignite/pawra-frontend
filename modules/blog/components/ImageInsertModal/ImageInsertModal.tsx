'use client';

import { useState } from 'react';
import { ImageInsertModalProps } from './ImageInsertModal.types';
import styles from './ImageInsertModal.module.scss';

export function ImageInsertModal({ isOpen, onClose, onInsert }: ImageInsertModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');

  if (!isOpen) return null;

  const handleInsert = () => {
    if (imageUrl.trim()) {
      onInsert(imageUrl, altText || 'Image');
      setImageUrl('');
      setAltText('');
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Insert Image</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Image URL *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Alt Text (optional)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Description of the image"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>

          {imageUrl && (
            <div className={styles.preview}>
              <p className={styles.previewLabel}>Preview:</p>
              <img src={imageUrl} alt={altText || 'Preview'} className={styles.previewImage} />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.insertButton}
            onClick={handleInsert}
            disabled={!imageUrl.trim()}
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}
