'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/modules/shared/contexts';
import { PlanCard, CurrentSubscription } from '../../components';
import { userSubscriptionService } from '../../services';
import type { SubscriptionPlan, UserSubscription } from '../../types';
import styles from './Subscription.module.scss';

export function SubscriptionPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use email as account identifier (backend should support this)
  const accountId = user?.email || '';

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [plansData, subscriptionData] = await Promise.all([
        userSubscriptionService.getAvailablePlans(),
        accountId ? userSubscriptionService.getCurrentSubscription(accountId) : Promise.resolve(null),
      ]);

      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
    } catch (err) {
      console.error('Error loading subscription data:', err);
      setError('Không thể tải thông tin gói đăng ký. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!accountId) {
      setError('Vui lòng đăng nhập để đăng ký gói.');
      return;
    }

    try {
      setSubscribing(plan.id);
      setError(null);
      setSuccessMessage(null);

      await userSubscriptionService.subscribe(accountId, {
        subscriptionPlanId: plan.id,
      });

      setSuccessMessage(`Đăng ký gói ${plan.name} thành công!`);
      await loadData();
    } catch (err) {
      console.error('Error subscribing:', err);
      setError('Không thể đăng ký gói. Vui lòng thử lại sau.');
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    const confirmed = window.confirm(
      'Bạn có chắc muốn hủy gói đăng ký? Bạn sẽ vẫn có thể sử dụng đến hết thời hạn hiện tại.',
    );

    if (!confirmed) return;

    try {
      setSubscribing('cancel');
      setError(null);

      await userSubscriptionService.cancelSubscription(currentSubscription.id);
      setSuccessMessage('Đã hủy gói đăng ký thành công.');
      await loadData();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Không thể hủy gói. Vui lòng thử lại sau.');
    } finally {
      setSubscribing(null);
    }
  };

  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gói đăng ký</h1>
        <p className={styles.subtitle}>
          Chọn gói phù hợp để trải nghiệm đầy đủ tính năng chăm sóc thú cưng
        </p>
      </div>

      {error && (
        <div className={styles.alert + ' ' + styles.alertError}>
          <span className={styles.alertIcon}>⚠️</span>
          {error}
          <button className={styles.alertClose} onClick={() => setError(null)}>×</button>
        </div>
      )}

      {successMessage && (
        <div className={styles.alert + ' ' + styles.alertSuccess}>
          <span className={styles.alertIcon}>✓</span>
          {successMessage}
          <button className={styles.alertClose} onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}

      <section className={styles.currentSection}>
        <h2 className={styles.sectionTitle}>Gói hiện tại của bạn</h2>
        <CurrentSubscription
          subscription={currentSubscription}
          onUpgrade={scrollToPlans}
          onCancel={handleCancelSubscription}
          loading={subscribing === 'cancel'}
        />
      </section>

      <section id="plans-section" className={styles.plansSection}>
        <h2 className={styles.sectionTitle}>Các gói đăng ký</h2>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentSubscription?.planId === plan.id}
              onSelect={handleSelectPlan}
              loading={subscribing === plan.id}
            />
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
        <div className={styles.faqList}>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Tôi có thể đổi gói bất cứ lúc nào không?</h3>
            <p className={styles.faqAnswer}>
              Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Thay đổi sẽ có hiệu lực ngay lập tức.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Làm sao để hủy gói?</h3>
            <p className={styles.faqAnswer}>
              Bạn có thể hủy gói từ trang này. Sau khi hủy, bạn vẫn có thể sử dụng đến hết thời hạn đã thanh toán.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Phương thức thanh toán nào được hỗ trợ?</h3>
            <p className={styles.faqAnswer}>
              Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ, ví điện tử MoMo, ZaloPay và chuyển khoản ngân hàng.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
