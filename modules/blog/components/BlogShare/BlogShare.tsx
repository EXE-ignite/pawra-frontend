'use client';

import React, { useState } from 'react';
import { Toast } from '@/modules/shared/components';
import { useTranslation } from '@/modules/shared/contexts';
import { BlogShareProps } from './BlogShare.types';
import styles from './BlogShare.module.scss';

type ShareTarget = 'facebook' | 'x' | 'messenger';

function getShareUrl(postId: string) {
  if (typeof window === 'undefined') {
    return `/blog/${postId}`;
  }

  return new URL(`/blog/${postId}`, window.location.origin).toString();
}

function buildShareText(title: string, excerpt?: string) {
  if (!excerpt) {
    return title;
  }

  return `${title} - ${excerpt}`;
}

function buildSocialUrl(target: ShareTarget, url: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  if (target === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }

  if (target === 'messenger') {
    return `fb-messenger://share/?link=${encodedUrl}`;
  }

  return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
}

async function copyToClipboard(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard API is not available');
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function BlogShare({ post, variant = 'panel' }: BlogShareProps) {
  const { t } = useTranslation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const shareUrl = getShareUrl(post.id);
  const shareText = buildShareText(post.title, post.excerpt);

  async function handleCopyLink() {
    try {
      await copyToClipboard(shareUrl);
      setToast({ message: t('blog.linkCopied'), type: 'success' });
    } catch {
      setToast({ message: t('blog.shareUnavailable'), type: 'error' });
    }
  }

  async function handleNativeShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    await handleCopyLink();
  }

  function handleSocialShare(target: ShareTarget) {
    if (typeof window === 'undefined') {
      return;
    }

    const shareWindow = window.open(
      buildSocialUrl(target, shareUrl, shareText),
      '_blank',
      'noopener,noreferrer,width=640,height=720'
    );

    if (!shareWindow) {
      setToast({ message: t('blog.shareUnavailable'), type: 'error' });
    }
  }

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          className={styles.iconButton}
          onClick={handleNativeShare}
          aria-label={t('blog.share')}
          title={t('blog.share')}
        >
          ↗
        </button>
      ) : (
        <div className={styles.panel}>
          <h3 className={styles.title}>{t('blog.shareArticle')}</h3>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.shareButton}
              onClick={handleCopyLink}
              aria-label={t('blog.copyLink')}
            >
              <span>⧉</span>
              <span className={styles.shareLabel}>{t('blog.copyLink')}</span>
            </button>
            <button
              type="button"
              className={styles.shareButton}
              onClick={() => handleSocialShare('facebook')}
              aria-label={t('blog.shareOnFacebook')}
            >
              <span>f</span>
              <span className={styles.shareLabel}>Facebook</span>
            </button>
            <button
              type="button"
              className={styles.shareButton}
              onClick={() => handleSocialShare('x')}
              aria-label={t('blog.shareOnX')}
            >
              <span>X</span>
              <span className={styles.shareLabel}>X</span>
            </button>
            <button
              type="button"
              className={styles.shareButton}
              onClick={() => handleSocialShare('messenger')}
              aria-label={t('blog.shareOnMessenger')}
            >
              <span>✉</span>
              <span className={styles.shareLabel}>Messenger</span>
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}