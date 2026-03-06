import React from 'react';
import { DocumentVaultProps } from './DocumentVault.types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './DocumentVault.module.scss';

export function DocumentVault({ documents, onUpload, onView }: DocumentVaultProps) {
  const { t } = useTranslation();
  function getDocumentIcon(type: string) {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'image':
        return '🖼️';
      default:
        return '📎';
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>📁</span>
          {t('documentVault.title')}
        </h2>
        {onUpload && (
          <button className={styles.uploadButton} onClick={onUpload}>
            <span className={styles.uploadIcon}>+</span>
            {t('documentVault.uploadNew')}
          </button>
        )}
      </div>

      <div className={styles.list}>
        {documents.map((document) => (
          <div
            key={document.id}
            className={styles.item}
            onClick={() => onView?.(document.id)}
          >
            <div className={styles.itemIcon}>
              {getDocumentIcon(document.type)}
            </div>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{document.name}</p>
              <p className={styles.itemMeta}>{document.size} • {document.uploadDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
