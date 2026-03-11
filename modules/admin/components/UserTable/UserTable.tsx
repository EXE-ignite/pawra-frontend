'use client';

import Image from 'next/image';
import { UserTableProps } from './UserTable.types';
import styles from './UserTable.module.scss';

const ROLE_LABELS: Record<string, string> = {
  Admin: 'Admin',
  Staff: 'Nhân viên',
  Vet: 'Bác sĩ thú y',
  Receptionist: 'Lễ tân',
  PetOwner: 'Chủ thú cưng',
  Customer: 'Khách hàng',
};

export function UserTable({
  users,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  onEdit,
  onDelete,
}: UserTableProps) {
  const safeUsers = users || [];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return styles.statusActive;
      case 'Inactive':
        return styles.statusInactive;
      case 'Banned':
        return styles.statusBanned;
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Active':
        return 'Hoạt động';
      case 'Inactive':
        return 'Không hoạt động';
      case 'Banned':
        return 'Bị khóa';
      default:
        return status;
    }
  };

  const getRoleClass = (role: string) => {
    switch (role) {
      case 'Admin':
        return styles.roleAdmin;
      case 'Staff':
        return styles.roleStaff;
      case 'Vet':
        return styles.roleVet;
      case 'Receptionist':
        return styles.roleReceptionist;
      default:
        return styles.roleDefault;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
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
        </button>,
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
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Lần đăng nhập cuối</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {safeUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              safeUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      {user.avatarUrl ? (
                        <div className={styles.avatar}>
                          <Image
                            src={user.avatarUrl}
                            alt={user.fullName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className={styles.avatarInitials}>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{user.fullName}</p>
                        <p className={styles.userEmail}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.roleBadge} ${getRoleClass(user.role)}`}>
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(user.status)}`}>
                      <span className={styles.statusDot} />
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{formatDate(user.joinedDate)}</td>
                  <td className={styles.dateCell}>
                    {user.lastLogin ? formatDate(user.lastLogin) : '—'}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => onEdit(user)}
                        title="Chỉnh sửa"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => {
                          if (confirm(`Xóa người dùng "${user.fullName}"?`)) {
                            onDelete(user.id);
                          }
                        }}
                        title="Xóa"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <p className={styles.paginationInfo}>
            Tổng <strong>{totalResults}</strong> người dùng
          </p>
          <div className={styles.paginationButtons}>
            <button
              className={styles.pageButton}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              ‹
            </button>
            {renderPagination()}
            <button
              className={styles.pageButton}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
