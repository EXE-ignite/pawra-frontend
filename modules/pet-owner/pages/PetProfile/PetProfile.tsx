'use client';

import React from 'react';
import { PetProfilePageProps } from './PetProfile.types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './PetProfile.module.scss';

export function PetProfilePage({
  petProfile,
  onEditProfile,
  onDeletePet,
  onExportPdf,
  onAddRecord,
}: PetProfilePageProps) {
  const { t } = useTranslation();
  function getStatusClass(status: string) {
    switch (status) {
      case 'valid': return styles.statusValid;
      case 'due-soon': return styles.statusDueSoon;
      case 'overdue': return styles.statusOverdue;
      default: return styles.statusValid;
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'valid': return t('petProfile.valid');
      case 'due-soon': return t('petProfile.dueSoon');
      case 'overdue': return t('petProfile.overdue');
      default: return t('petProfile.valid');
    }
  }

  function getTagClass(color: string) {
    switch (color) {
      case 'blue': return styles.tagBlue;
      case 'orange': return styles.tagOrange;
      case 'green': return styles.tagGreen;
      case 'yellow': return styles.tagYellow;
      case 'pink': return styles.tagPink;
      case 'purple': return styles.tagPurple;
      default: return styles.tagBlue;
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Pet Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerAvatar}>
            {petProfile.imageUrl ? (
              <img src={petProfile.imageUrl} alt={petProfile.name} className={styles.headerAvatarImg} />
            ) : (
              <span className={styles.headerAvatarPlaceholder}>🐾</span>
            )}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerNameRow}>
              <h1 className={styles.headerName}>{petProfile.name}</h1>
              {petProfile.status === 'active' && (
                <span className={styles.activeBadge}>{t('petProfile.active')}</span>
              )}
            </div>
            <div className={styles.headerAttributes}>
              <span className={styles.attribute}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4a2 2 0 1 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a2 2 0 1 0 0 4h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1a2 2 0 1 0-4 0v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H4a2 2 0 1 1 0-4h1a1 1 0 0 0 1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1V4z"/></svg>
                {petProfile.breed}
              </span>
              {petProfile.color && (
                <span className={styles.attribute}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/></svg>
                  {petProfile.color}
                </span>
              )}
              <span className={styles.attribute}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {petProfile.age} {t('petProfile.years')} {petProfile.ageMonths} {t('petProfile.months')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.editButton} onClick={onEditProfile}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            {t('petProfile.editProfile')}
          </button>
          {onDeletePet && (
            <button className={styles.deleteButton} onClick={onDeletePet}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              {t('common.delete')}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className={styles.content}>
        {/* Left Panel */}
        <aside className={styles.leftPanel}>
          <div className={styles.petImageWrapper}>
            {petProfile.imageUrl ? (
              <img src={petProfile.imageUrl} alt={petProfile.name} className={styles.petImage} />
            ) : (
              <div className={styles.petImagePlaceholder}>🐾</div>
            )}
          </div>

          {petProfile.summary && (
            <div className={styles.summarySection}>
              <h3 className={styles.summaryTitle}>{t('petProfile.petSummary')}</h3>
              <p className={styles.summaryText}>{petProfile.summary}</p>
            </div>
          )}

          {(petProfile.hobbies?.length || petProfile.favoriteThings?.length) ? (
            <div className={styles.interestsSection}>
              <h3 className={styles.interestsTitle}>
                <svg className={styles.heartIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {t('petProfile.personalInterests')}
              </h3>

              {petProfile.hobbies && petProfile.hobbies.length > 0 && (
                <div className={styles.tagGroup}>
                  <span className={styles.tagGroupLabel}>{t('petProfile.favoriteHobbies')}</span>
                  <div className={styles.tagList}>
                    {petProfile.hobbies.map((tag, i) => (
                      <span key={i} className={`${styles.tag} ${getTagClass(tag.color)}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {petProfile.favoriteThings && petProfile.favoriteThings.length > 0 && (
                <div className={styles.tagGroup}>
                  <span className={styles.tagGroupLabel}>{t('petProfile.favoriteThings')}</span>
                  <div className={styles.tagList}>
                    {petProfile.favoriteThings.map((tag, i) => (
                      <span key={i} className={`${styles.tag} ${getTagClass(tag.color)}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </aside>

        {/* Right Panel */}
        <section className={styles.rightPanel}>
          <div className={styles.vaccinationCard}>
            <div className={styles.vaccinationHeader}>
              <div className={styles.vaccinationTitleGroup}>
                <svg className={styles.vaccinationIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <div>
                  <h2 className={styles.vaccinationTitle}>{t('petProfile.vaccinationHistory')}</h2>
                  <p className={styles.vaccinationSubtitle}>{t('petProfile.vaccinationSubtitle')}</p>
                </div>
              </div>
              <button className={styles.addButton} onClick={onAddRecord} aria-label="Add vaccination">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('petProfile.vaccineType')}</th>
                    <th>{t('petProfile.dateAdministered')}</th>
                    <th>{t('petProfile.expirationDate')}</th>
                    <th>{t('petProfile.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {petProfile.vaccinations.map((v) => (
                    <tr key={v.id}>
                      <td className={styles.vaccineName}>{v.name}</td>
                      <td>{v.dateAdministered}</td>
                      <td>{v.expirationDate}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(v.status)}`}>
                          <span className={styles.statusDot} />
                          {getStatusLabel(v.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {petProfile.vaccinationAlert && (
              <div className={styles.alertBox}>
                <div className={styles.alertIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <p className={styles.alertTitle}>{t('petProfile.vaccinationAlert')}</p>
                  <p className={styles.alertText}>{petProfile.vaccinationAlert}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p className={styles.footerSync}>
          <span className={styles.syncDot} />
          SYSTEM SYNCED: MAR 22, 2024 09:41AM
        </p>
        <p className={styles.footerInfo}>
          {petProfile.name} Jenkins • Profile ID: PET-{petProfile.id} • Secured by PetHub Cloud
        </p>
      </footer>

      {/* ── FAB ── */}
      <button className={styles.fab} aria-label="Add new record">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
}
