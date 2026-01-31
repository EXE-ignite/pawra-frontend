'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/shared/contexts';
import { Button } from '@/modules/shared';
import styles from './page.module.scss';

type AppointmentStatus = 'Pending' | 'Approved' | 'Rejected';

type AppointmentRequest = {
  id: string;
  customerName: string;
  petName: string;
  clinicName: string;
  veterinarianName: string;
  appointmentTime: string; // ISO
  status: AppointmentStatus;
};

const MOCK_REQUESTS: AppointmentRequest[] = [
  {
    id: 'apt-1001',
    customerName: 'Khách hàng A',
    petName: 'KIKI',
    clinicName: 'Phòng khám Dịch vụ - A',
    veterinarianName: 'BS. Nguyễn Văn A',
    appointmentTime: '2026-01-28T09:00:00.000Z',
    status: 'Pending',
  },
  {
    id: 'apt-1002',
    customerName: 'Khách hàng B',
    petName: 'MILO',
    clinicName: 'Phòng khám Vaccine - A',
    veterinarianName: 'BS. Lê Văn C',
    appointmentTime: '2026-01-28T10:00:00.000Z',
    status: 'Pending',
  },
];

export default function ClinicManagerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [requests, setRequests] = useState<AppointmentRequest[]>(MOCK_REQUESTS);

  const role = user?.role;
  const isClinicManager = role === 'ClinicManager';

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === 'Pending').length,
    [requests]
  );

  const handleApprove = async (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
    // TODO: call PUT /api/Appointment/update/{id} with status = Approved
  };

  const handleReject = async (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
    // TODO: call PUT /api/Appointment/update/{id} with status = Rejected
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Quản lý phòng khám</h1>
          <p className={styles.subtitle}>
            Duyệt hoặc từ chối các yêu cầu đặt lịch khám từ khách hàng.
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" size="md" onClick={() => router.push('/')}
            >Về trang chủ</Button
          >
        </div>
      </div>

      {!isClinicManager && (
        <div className={styles.warning}>
          Tài khoản hiện tại không phải <b>ClinicManager</b> (role: {role || 'N/A'}). Trang này chỉ dành cho quản lý phòng khám.
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Yêu cầu chờ duyệt</div>
          <div className={styles.statValue}>{pendingCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tổng yêu cầu</div>
          <div className={styles.statValue}>{requests.length}</div>
        </div>
      </div>

      <div className={styles.list}>
        {requests.map((r) => (
          <div key={r.id} className={styles.card}>
            <div className={styles.cardMain}>
              <div className={styles.cardTitle}>
                #{r.id} • {r.petName} • {r.customerName}
              </div>
              <div className={styles.cardMeta}>
                <div>
                  <b>Phòng khám:</b> {r.clinicName}
                </div>
                <div>
                  <b>Bác sĩ:</b> {r.veterinarianName}
                </div>
                <div>
                  <b>Thời gian:</b> {new Date(r.appointmentTime).toLocaleString()}
                </div>
              </div>
            </div>

            <div className={styles.cardRight}>
              <div className={styles.status} data-status={r.status}>
                {r.status}
              </div>
              <div className={styles.cardButtons}>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={r.status !== 'Pending' || !isClinicManager}
                  onClick={() => handleApprove(r.id)}
                >
                  Duyệt
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={r.status !== 'Pending' || !isClinicManager}
                  onClick={() => handleReject(r.id)}
                >
                  Từ chối
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footerNote}>
        Ghi chú: Hiện đang dùng dữ liệu mock. Bước tiếp theo sẽ nối API thật: GET /api/Appointment và PUT /api/Appointment/update/{'{'}id{'}'}.
      </div>
    </div>
  );
}
