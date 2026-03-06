'use client';

import { useTranslation } from '@/modules/shared';

export default function CustomerDashboardPage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{t('customerDashboard.title')}</h1>
      <p>{t('customerDashboard.welcome')}</p>
    </div>
  );
}
