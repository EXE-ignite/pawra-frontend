'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserDropdownProps } from './UserDropdown.types';
import styles from './UserDropdown.module.scss';

export function UserDropdown({ userName, userEmail, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className={styles.userDropdown} ref={dropdownRef}>
      <button 
        className={styles.avatarButton}
        onClick={toggleDropdown}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className={styles.avatar}>
          {userName.charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{userName}</p>
              <p className={styles.userEmail}>{userEmail}</p>
            </div>
          </div>

          <div className={styles.divider} />

          <nav className={styles.menuList}>
            <button className={styles.menuItem}>
              <span className={styles.menuIcon}>👤</span>
              <span>Hồ sơ của tôi</span>
            </button>
            <button className={styles.menuItem}>
              <span className={styles.menuIcon}>⚙️</span>
              <span>Cài đặt</span>
            </button>
          </nav>

          <div className={styles.divider} />

          <button 
            className={`${styles.menuItem} ${styles.logoutItem}`}
            onClick={handleLogoutClick}
          >
            <span className={styles.menuIcon}>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}
