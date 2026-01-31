'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/modules/shared/contexts';
import { ROUTES } from '@/modules/shared/constants/routes';
import { Button } from '@/modules/shared';
import styles from './page.module.scss';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const bookingHref = useMemo(() => {
    return isAuthenticated ? '/customer/booking' : ROUTES.LOGIN;
  }, [isAuthenticated]);

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Chăm sóc thú cưng toàn diện</h1>
        <p className={styles.subtitle}>
          Dịch vụ thú y chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm. Đặt lịch khám nhanh chóng và tiện lợi.
        </p>

        <div className={styles.cta}>
          <Link href={bookingHref}>
            <Button variant="primary" size="lg">
              Đăng ký khám
            </Button>
          </Link>
          <Link href="/customer/dashboard">
            <Button variant="secondary" size="lg">
              Customer Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🏥</div>
          <h3 className={styles.featureTitle}>Khám tổng quát</h3>
          <p className={styles.featureText}>
            Theo dõi sức khỏe định kỳ, chẩn đoán sớm và tư vấn chăm sóc phù hợp cho thú cưng.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💉</div>
          <h3 className={styles.featureTitle}>Tiêm phòng</h3>
          <p className={styles.featureText}>
            Lịch tiêm phòng đầy đủ, nhắc lịch và theo dõi hồ sơ vaccine cho thú cưng.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🩺</div>
          <h3 className={styles.featureTitle}>Đặt lịch dễ dàng</h3>
          <p className={styles.featureText}>
            Chọn phòng khám, bác sĩ và khung giờ phù hợp. Nếu khung giờ đã có người đặt, hệ thống sẽ báo để bạn chọn lại.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📱</div>
          <h3 className={styles.featureTitle}>Theo dõi lịch hẹn</h3>
          <p className={styles.featureText}>
            Xem lịch hẹn, trạng thái duyệt và lịch khám được xác nhận từ quản lý phòng khám.
          </p>
        </div>
      </div>
    </div>
  );
}

