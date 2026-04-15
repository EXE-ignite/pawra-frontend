'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/modules/shared/contexts';
import { vetService } from '../../services/vet.service';
import type { Appointment, PetProfile } from '@/modules/pet-owner/types';
import styles from './VetDashboardPage.module.scss';
import type { VetDashboardPageProps } from './VetDashboardPage.types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function VetDashboardPage({}: VetDashboardPageProps) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      if (!user?.fullName) {
        setError('Không thể xác định tên bác sĩ.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const appointmentsForVet = await vetService.getAppointmentsForVet(user.fullName);
        if (cancelled) return;

        setAppointments(appointmentsForVet);

        const profiles = await vetService.getPetProfilesForAppointments(appointmentsForVet);
        if (cancelled) return;

        setPetProfiles(profiles);
      } catch (err) {
        console.error('[VetDashboardPage] loadDashboard error:', err);
        if (!cancelled) setError('Không thể tải dữ liệu lịch hẹn.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.header}>
        <div>
          <p className={styles.subtitle}>Bác sĩ thú y</p>
          <h1 className={styles.title}>Trang quản lý lịch hẹn</h1>
          <p className={styles.description}>
            Bạn chỉ xem thông tin lịch hẹn và hồ sơ thú cưng do chủ nuôi tạo. Không thể tạo mới pet hoặc đặt lịch trực tiếp từ đây.
          </p>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Lịch hẹn của bạn</h2>
              <span>{appointments.length} lịch hẹn</span>
            </div>

            {appointments.length === 0 ? (
              <div className={styles.emptyState}>
                Hiện tại chưa có cuộc hẹn nào do chủ nuôi đặt cho bạn.
              </div>
            ) : (
              <div className={styles.appointmentList}>
                {appointments.map((appointment) => (
                  <article key={appointment.id} className={styles.appointmentCard}>
                    <div className={styles.cardHeader}>
                      <h3>{appointment.petName}</h3>
                      <span className={styles.appointmentType}>{appointment.type}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <p>
                        <strong>Ngày:</strong> {formatDate(appointment.date)}
                      </p>
                      <p>
                        <strong>Giờ:</strong> {appointment.time}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong> {appointment.status}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Hồ sơ thú cưng</h2>
              <span>{petProfiles.length} hồ sơ</span>
            </div>

            {petProfiles.length === 0 ? (
              <div className={styles.emptyState}>
                Dữ liệu hồ sơ thú cưng sẽ xuất hiện khi có lịch hẹn của khách hàng.
              </div>
            ) : (
              <div className={styles.petGrid}>
                {petProfiles.map((pet) => (
                  <article key={pet.id} className={styles.petCard}>
                    <div className={styles.petHeader}>
                      <div>
                        <h3>{pet.name}</h3>
                        <p>{pet.species} • {pet.breed}</p>
                      </div>
                      {pet.status && <span className={styles.statusBadge}>{pet.status}</span>}
                    </div>
                    <div className={styles.petDetails}>
                      <p><strong>Tuổi:</strong> {pet.age} tuổi {pet.ageMonths} tháng</p>
                      {pet.weight != null && <p><strong>Cân nặng:</strong> {pet.weight} kg</p>}
                      {pet.microchipId && <p><strong>Microchip:</strong> {pet.microchipId}</p>}
                      {pet.lastVisit && <p><strong>Lần khám gần nhất:</strong> {new Date(pet.lastVisit).toLocaleDateString('vi-VN')}</p>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
