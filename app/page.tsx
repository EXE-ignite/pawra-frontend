'use client';

import { MainLayout, useTranslation } from '@/modules/shared';
import styles from './page.module.scss';

export default function Home() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className={styles.home}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            {t('home.title')}
          </h1>
          <p className={styles.subtitle}>
            {t('home.subtitle')}
          </p>
        </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🏥</div>
          <h3 className={styles.featureTitle}>{t('home.healthTracking')}</h3>
          <p className={styles.featureText}>
            {t('home.healthTrackingDesc')}
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📅</div>
          <h3 className={styles.featureTitle}>{t('home.easyScheduling')}</h3>
          <p className={styles.featureText}>
            {t('home.easySchedulingDesc')}
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💊</div>
          <h3 className={styles.featureTitle}>{t('home.medicationReminders')}</h3>
          <p className={styles.featureText}>
            {t('home.medicationRemindersDesc')}
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📱</div>
          <h3 className={styles.featureTitle}>{t('home.mobileAccess')}</h3>
          <p className={styles.featureText}>
            {t('home.mobileAccessDesc')}
          </p>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

