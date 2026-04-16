'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, useSubscription } from '@/modules/shared/contexts';
import { PlanCard, CurrentSubscription, PaymentInfoModal } from '@/modules/pet-owner/components';
import { userSubscriptionService } from '@/modules/pet-owner/services';
import { getProfile } from '@/modules/pet-owner/services/account-profile.service';
import type { SubscriptionPlan, UserSubscription } from '@/modules/pet-owner/types';
import styles from './VetSubscriptionPage.module.scss';

export function VetSubscriptionPage() {
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [accountId, setAccountId] = useState('');

  useEffect(() => {
    if (!user) return;
    getProfile()
      .then((profile) => setAccountId(profile.accountId))
      .catch((err) => console.error('[VetSubscriptionPage] Could not load profile:', err));
  }, [user]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [plansData, subscriptionData] = await Promise.all([
        userSubscriptionService.getAvailablePlans().catch((err) => {
          console.warn('Could not load plans:', err);
          return [] as SubscriptionPlan[];
        }),
        accountId
          ? userSubscriptionService.getCurrentSubscription(accountId).catch(() => null)
          : Promise.resolve(null),
      ]);

      setPlans(plansData);

      let enriched = subscriptionData;
      if (enriched && plansData.length > 0) {
        const matched = plansData.find((p) => p.id === enriched!.planId);
        if (matched) {
          enriched = { ...enriched, planName: matched.name, price: matched.price };
        }
      }
      setCurrentSubscription(enriched);
    } catch (err) {
      console.error('Error loading vet subscription data:', err);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    const confirmed = window.confirm(
      'Bạn có chắc muốn hủy gói đăng ký? Bạn sẽ vẫn có thể sử dụng đến hết thời hạn hiện tại.',
    );

    if (!confirmed) return;

    try {
      setError(null);
      await userSubscriptionService.cancelSubscription(currentSubscription.id);
      await loadData();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Không thể hủy gói. Vui lòng thử lại sau.');
    }
  };

  const scrollToPlans = () => {
    document.getElementById('vet-plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConfirmPayment = useCallback(
    async (plan: SubscriptionPlan) => {
      let id = accountId;
      if (!id) {
        const profile = await getProfile();
        id = profile.accountId;
        if (id) setAccountId(id);
      }
      if (!id) throw new Error('Không thể xác định tài khoản. Vui lòng đăng nhập lại.');
      await userSubscriptionService.subscribe(id, {
        subscriptionPlanId: plan.id,
        durationInDays: plan.durationInDays,
      });
      await Promise.all([loadData(), refreshSubscription()]);
    },
    [accountId, loadData, refreshSubscription],
  );

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
        <h1 className={styles.title}>Gói dịch vụ thú y</h1>
        <p className={styles.subtitle}>
          Chọn gói phù hợp để mở rộng tính năng quản lý phòng khám và nâng cao dịch vụ của bạn
        </p>
      </div>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <span className={styles.alertIcon}>⚠️</span>
          {error}
          <button className={styles.alertClose} onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <section className={styles.currentSection}>
        <h2 className={styles.sectionTitle}>Gói hiện tại của bạn</h2>
        <CurrentSubscription
          subscription={currentSubscription}
          onUpgrade={scrollToPlans}
          onCancel={handleCancelSubscription}
          loading={false}
        />
      </section>

      <section id="vet-plans-section" className={styles.plansSection}>
        <h2 className={styles.sectionTitle}>Các gói đăng ký</h2>
        <p className={styles.plansNote}>
          Chọn gói bên dưới, nhấn "Đăng ký" và chuyển khoản theo thông tin hiển thị.
        </p>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentSubscription?.planId === plan.id}
              onSelect={handleSelectPlan}
              loading={false}
            />
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
        <div className={styles.faqList}>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Làm thế nào để đăng ký gói?</h3>
            <p className={styles.faqAnswer}>
              Chọn gói bạn muốn, nhấn &quot;Đăng ký&quot;, sau đó chuyển khoản theo thông tin
              hiển thị. Admin sẽ kích hoạt gói cho bạn trong vòng 24 giờ.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Tôi có thể đổi gói bất cứ lúc nào không?</h3>
            <p className={styles.faqAnswer}>
              Có, bạn có thể nâng cấp hoặc thay đổi gói bất cứ lúc nào bằng cách liên hệ đội ngũ
              hỗ trợ.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Thanh toán mất bao lâu để được xác nhận?</h3>
            <p className={styles.faqAnswer}>
              Sau khi chuyển khoản, gói sẽ được kích hoạt trong vòng 24 giờ làm việc. Bạn sẽ nhận
              được thông báo khi gói được kích hoạt.
            </p>
          </div>
        </div>
      </section>

      {selectedPlan && (
        <PaymentInfoModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}
