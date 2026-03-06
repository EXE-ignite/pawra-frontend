import Image from 'next/image';
import { BlogTableProps } from './BlogTable.types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './BlogTable.module.scss';

export function BlogTable({
  posts,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: BlogTableProps) {
  const { t } = useTranslation();
  const safePost = posts || [];
  const startResult = (currentPage - 1) * safePost.length + 1;
  const endResult = Math.min(currentPage * safePost.length, totalResults);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Published':
        return styles.statusPublished;
      case 'Draft':
        return styles.statusDraft;
      case 'Scheduled':
        return styles.statusScheduled;
      default:
        return '';
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pages.unshift(<span key="ellipsis-start" className={styles.ellipsis}>...</span>);
    }
    if (endPage < totalPages) {
      pages.push(<span key="ellipsis-end" className={styles.ellipsis}>...</span>);
    }

    return pages;
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('blog.tableTitle')}</th>
              <th>{t('blog.tableAuthor')}</th>
              <th>{t('blog.tableCategory')}</th>
              <th>{t('blog.tableStatus')}</th>
              <th>{t('blog.tableDate')}</th>
              <th>{t('blog.tableActions')}</th>
            </tr>
          </thead>
          <tbody>
            {safePost.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  {t('blog.noPosts')}
                </td>
              </tr>
            ) : (
              safePost.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className={styles.titleCell}>
                      {post.thumbnailUrl ? (
                        <div className={styles.thumbnail}>
                          <Image
                            src={post.thumbnailUrl}
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className={styles.thumbnail} style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#999' }}>{t('blog.noImage')}</span>
                        </div>
                      )}
                      <div className={styles.titleContent}>
                        <h4 className={styles.title}>{post.title}</h4>
                        <p className={styles.slug}>{post.slug}</p>
                      </div>
                    </div>
                  </td>
                <td>
                  <div className={styles.authorCell}>
                    {post.author.avatarUrl ? (
                      <div className={styles.authorAvatar}>
                        <Image
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className={styles.authorInitials}>
                        {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <span>{post.author.name}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.category}>{post.category}</span>
                </td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(post.status)}`}>
                    <span className={styles.statusDot}></span>
                    {post.status}
                  </span>
                </td>
                <td>
                  <span className={styles.date}>{post.date}</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => onView(post.id)}
                      title="View"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => onEdit(post.id)}
                      title="Edit"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => onDelete(post.id)}
                      title="Delete"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <p className={styles.paginationInfo}>
          Showing {startResult} to {endResult} of {totalResults} results
        </p>
        <div className={styles.paginationControls}>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPagination()}
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
