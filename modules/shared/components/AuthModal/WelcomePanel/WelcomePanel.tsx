import React from 'react';
import { WelcomePanelProps } from './WelcomePanel.types';
import { useTranslation } from '../../../contexts';
import styles from './WelcomePanel.module.scss';

export function WelcomePanel({ mode, onToggle }: WelcomePanelProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {mode === 'signin' ? (
        <>
          <h2 className={styles.title}>{t('auth.helloFriend')}</h2>
          <p className={styles.text}>
            {t('auth.helloFriendDesc')}
          </p>
          <button className={styles.button} onClick={onToggle}>
            {t('auth.signUp')}
          </button>
        </>
      ) : (
        <>
          <h2 className={styles.title}>{t('auth.welcomeBack')}</h2>
          <p className={styles.text}>
            {t('auth.welcomeBackDesc')}
          </p>
          <button className={styles.button} onClick={onToggle}>
            {t('auth.signIn')}
          </button>
        </>
      )}
    </div>
  );
}
