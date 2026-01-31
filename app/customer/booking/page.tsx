'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/modules/shared';
import { useAuth } from '@/modules/shared/contexts';
import { ROUTES } from '@/modules/shared/constants/routes';
import styles from './page.module.scss';

type BookingType = 'service' | 'vaccine';

type MockClinic = { id: string; name: string; type: BookingType };

type MockVet = { id: string; name: string; clinicId: string };

const MOCK_CLINICS: MockClinic[] = [
  { id: 'clinic-service-1', name: 'Phòng khám Dịch vụ - A', type: 'service' },
  { id: 'clinic-service-2', name: 'Phòng khám Dịch vụ - B', type: 'service' },
  { id: 'clinic-vaccine-1', name: 'Phòng khám Vaccine - A', type: 'vaccine' },
];

const MOCK_VETS: MockVet[] = [
  { id: 'vet-1', name: 'BS. Nguyễn Văn A', clinicId: 'clinic-service-1' },
  { id: 'vet-2', name: 'BS. Trần Thị B', clinicId: 'clinic-service-1' },
  { id: 'vet-3', name: 'BS. Lê Văn C', clinicId: 'clinic-vaccine-1' },
];

function toLocalDateTimeInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CustomerBookingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [bookingType, setBookingType] = useState<BookingType>('service');
  const [clinicId, setClinicId] = useState('');
  const [veterinarianId, setVeterinarianId] = useState('');
  const [petId, setPetId] = useState('');
  const [appointmentTime, setAppointmentTime] = useState(() => toLocalDateTimeInputValue(new Date()));
  const [error, setError] = useState('');

  const clinics = useMemo(() => MOCK_CLINICS.filter((c) => c.type === bookingType), [bookingType]);
  const vets = useMemo(() => MOCK_VETS.filter((v) => v.clinicId === clinicId), [clinicId]);

  const handleGoLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleSubmit = async () => {
    setError('');

    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    if (!clinicId || !veterinarianId || !petId || !appointmentTime) {
      setError('Vui lòng chọn đầy đủ phòng khám, bác sĩ, thú cưng và thời gian.');
      return;
    }

    // TODO: integrate real API POST /api/Appointment/create
    // For now, just show success and the payload.
    alert(
      `Đã tạo yêu cầu đặt lịch (mock).\n\nclinicId: ${clinicId}\nveterinarianId: ${veterinarianId}\npetId: ${petId}\nappointmentTime: ${new Date(appointmentTime).toISOString()}`
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Đăng ký khám</h1>
        <p className={styles.subtitle}>
          Chọn phòng khám, bác sĩ và khung giờ. Nếu chưa đăng nhập, hệ thống sẽ chuyển bạn về trang đăng nhập.
        </p>
      </div>

      {!isAuthenticated && (
        <div className={styles.notice}>
          <div className={styles.noticeText}>
            Bạn chưa đăng nhập. Hãy đăng nhập để đặt lịch khám.
          </div>
          <Button variant="primary" size="md" onClick={handleGoLogin}>
            Đăng nhập
          </Button>
        </div>
      )}

      <div className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>
            Loại khám
            <select
              className={styles.input}
              value={bookingType}
              onChange={(e) => {
                const next = e.target.value as BookingType;
                setBookingType(next);
                setClinicId('');
                setVeterinarianId('');
              }}
            >
              <option value="service">Dịch vụ</option>
              <option value="vaccine">Vaccine</option>
            </select>
          </label>

          <label className={styles.label}>
            Phòng khám
            <select
              className={styles.input}
              value={clinicId}
              onChange={(e) => {
                setClinicId(e.target.value);
                setVeterinarianId('');
              }}
            >
              <option value="">-- Chọn phòng khám --</option>
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            Bác sĩ
            <select
              className={styles.input}
              value={veterinarianId}
              onChange={(e) => setVeterinarianId(e.target.value)}
              disabled={!clinicId}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {vets.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Thú cưng (tạm thời nhập ID)
            <input
              className={styles.input}
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              placeholder="vd: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            Ngày & giờ khám
            <input
              className={styles.input}
              type="datetime-local"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <Button variant="secondary" size="md" onClick={() => router.back()}>
            Quay lại
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            Đặt lịch
          </Button>
        </div>
      </div>

      <div className={styles.footerNote}>
        Ghi chú: Hiện API list Clinic/Veterinarian đang bị 403 nên danh sách đang dùng dữ liệu mock. Khi backend mở quyền, mình sẽ nối dữ liệu thật.
      </div>
    </div>
  );
}
