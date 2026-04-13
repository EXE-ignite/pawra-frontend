'use client';

import { useState, useEffect, useCallback } from 'react';
import { clinicManagerService } from '../../services/clinic-manager.service';
import { useAuth } from '@/modules/shared/contexts';
import type { Clinic, ClinicService, ClinicVaccine, Veterinarian, ClinicStats, ClinicManagerTab } from '../../types';
import styles from './ClinicManagerPage.module.scss';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className={styles.statInfo}>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

interface BadgeProps {
  active: boolean;
}

function AvailableBadge({ active }: BadgeProps) {
  return (
    <span className={active ? styles.badgeActive : styles.badgeInactive}>
      {active ? 'Hoạt động' : 'Tạm ngưng'}
    </span>
  );
}

// ─── Tab: Clinic Overview ────────────────────────────────────────────────────

interface OverviewTabProps {
  clinic: Clinic;
  onEditClick: () => void;
}

function OverviewTab({ clinic, onEditClick }: OverviewTabProps) {
  return (
    <div className={styles.overviewGrid}>
      {clinic.imageUrl && (
        <div className={styles.clinicImageWrapper}>
          <img src={clinic.imageUrl} alt={clinic.name ?? 'Clinic'} className={styles.clinicImage} />
        </div>
      )}
      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          <h3 className={styles.infoCardTitle}>Thông tin phòng khám</h3>
          <button className={styles.editBtn} onClick={onEditClick}>✏️ Chỉnh sửa</button>
        </div>
        <dl className={styles.infoList}>
          <div className={styles.infoItem}>
            <dt className={styles.infoLabel}>Tên phòng khám</dt>
            <dd className={styles.infoValue}>{clinic.name ?? '—'}</dd>
          </div>
          <div className={styles.infoItem}>
            <dt className={styles.infoLabel}>Địa chỉ</dt>
            <dd className={styles.infoValue}>{clinic.address ?? '—'}</dd>
          </div>
          <div className={styles.infoItem}>
            <dt className={styles.infoLabel}>Số điện thoại</dt>
            <dd className={styles.infoValue}>{clinic.phone ?? '—'}</dd>
          </div>
          <div className={styles.infoItem}>
            <dt className={styles.infoLabel}>Ngày tạo</dt>
            <dd className={styles.infoValue}>{formatDate(clinic.createdDate)}</dd>
          </div>
          <div className={styles.infoItem}>
            <dt className={styles.infoLabel}>Cập nhật lần cuối</dt>
            <dd className={styles.infoValue}>{formatDate(clinic.updatedDate)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

// ─── Tab: Vets ───────────────────────────────────────────────────────────────

interface VetTableProps {
  vets: Veterinarian[];
  loading: boolean;
}

function VetTable({ vets, loading }: VetTableProps) {
  if (loading) return <div className={styles.loadingRow}>Đang tải bác sĩ...</div>;
  if (vets.length === 0) return <div className={styles.emptyRow}>Chưa có bác sĩ nào.</div>;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số giấy phép</th>
            <th>Ngày tham gia</th>
          </tr>
        </thead>
        <tbody>
          {vets.map((v) => (
            <tr key={v.id}>
              <td>
                <div className={styles.vetCell}>
                  {v.avatarUrl ? (
                    <img src={v.avatarUrl} alt={v.fullName ?? ''} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>{(v.fullName ?? 'V')[0].toUpperCase()}</div>
                  )}
                  <span>{v.fullName ?? v.accountId}</span>
                </div>
              </td>
              <td>{v.email ?? '—'}</td>
              <td>{v.licenseNumber ?? '—'}</td>
              <td>{formatDate(v.createdDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab: Services ───────────────────────────────────────────────────────────

interface ServiceTableProps {
  services: ClinicService[];
  loading: boolean;
  onToggle: (id: string, isAvailable: boolean, price: number) => void;
}

function ServiceTable({ services, loading, onToggle }: ServiceTableProps) {
  if (loading) return <div className={styles.loadingRow}>Đang tải dịch vụ...</div>;
  if (services.length === 0) return <div className={styles.emptyRow}>Chưa có dịch vụ nào.</div>;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tên dịch vụ</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>
                <div className={styles.serviceCell}>
                  {s.serviceImageUrl && (
                    <img src={s.serviceImageUrl} alt={s.serviceName ?? ''} className={styles.serviceImg} />
                  )}
                  <span>{s.serviceName ?? '—'}</span>
                </div>
              </td>
              <td className={styles.descCell}>{s.serviceDescription ?? '—'}</td>
              <td>{formatCurrency(s.price)}</td>
              <td><AvailableBadge active={s.isAvailable} /></td>
              <td>
                <button
                  className={s.isAvailable ? styles.deactivateBtn : styles.activateBtn}
                  onClick={() => onToggle(s.id, !s.isAvailable, s.price)}
                >
                  {s.isAvailable ? 'Tạm ngưng' : 'Kích hoạt'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab: Vaccines ───────────────────────────────────────────────────────────

interface VaccineTableProps {
  vaccines: ClinicVaccine[];
  loading: boolean;
  onToggle: (id: string, isAvailable: boolean, price: number) => void;
}

function VaccineTable({ vaccines, loading, onToggle }: VaccineTableProps) {
  if (loading) return <div className={styles.loadingRow}>Đang tải vaccine...</div>;
  if (vaccines.length === 0) return <div className={styles.emptyRow}>Chưa có vaccine nào.</div>;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tên vaccine</th>
            <th>Nhà sản xuất</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map((v) => (
            <tr key={v.id}>
              <td>{v.vaccineName ?? '—'}</td>
              <td>{v.manufacturer ?? '—'}</td>
              <td>{formatCurrency(v.price)}</td>
              <td><AvailableBadge active={v.isAvailable} /></td>
              <td>
                <button
                  className={v.isAvailable ? styles.deactivateBtn : styles.activateBtn}
                  onClick={() => onToggle(v.id, !v.isAvailable, v.price)}
                >
                  {v.isAvailable ? 'Tạm ngưng' : 'Kích hoạt'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Edit Clinic Modal ────────────────────────────────────────────────────────

interface EditClinicModalProps {
  clinic: Clinic;
  onSave: (data: { name: string; address: string; phone: string }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

function EditClinicModal({ clinic, onSave, onClose, saving }: EditClinicModalProps) {
  const [name, setName] = useState(clinic.name ?? '');
  const [address, setAddress] = useState(clinic.address ?? '');
  const [phone, setPhone] = useState(clinic.phone ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ name, address, phone });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Chỉnh sửa phòng khám</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tên phòng khám *</label>
            <input
              className={styles.formInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Địa chỉ *</label>
            <input
              className={styles.formInput}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số điện thoại *</label>
            <input
              className={styles.formInput}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>
              Hủy
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ClinicManagerPage() {
  const { user } = useAuth();

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [services, setServices] = useState<ClinicService[]>([]);
  const [vaccines, setVaccines] = useState<ClinicVaccine[]>([]);
  const [stats, setStats] = useState<ClinicStats>({ totalVets: 0, totalServices: 0, totalVaccines: 0 });
  const [activeTab, setActiveTab] = useState<ClinicManagerTab>('overview');

  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingVets, setLoadingVets] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Initial: load clinics ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return; // wait for auth context to load
    (async () => {
      try {
        setLoadingClinics(true);
        const list = await clinicManagerService.getClinics();
        setClinics(list);
        if (list.length > 0) setSelectedClinic(list[0]);
      } catch (err: unknown) {
        const msg = err && typeof err === 'object'
          ? ((err as Record<string, unknown>).message as string) || JSON.stringify(err)
          : String(err);
        console.error('[ClinicManagerPage] getClinics error:', msg, err);
        setError('Không thể tải dữ liệu phòng khám.');
      } finally {
        setLoadingClinics(false);
      }
    })();
  }, [user]);

  // ── Load tab data when clinic changes ─────────────────────────────────────
  const loadVets = useCallback(async (clinicId: string) => {
    setLoadingVets(true);
    try {
      const data = await clinicManagerService.getVeterinarians(clinicId);
      setVets(data);
      setStats((prev) => ({ ...prev, totalVets: data.length }));
    } catch (err) {
      console.error('[ClinicManagerPage] getVeterinarians error:', err);
    } finally {
      setLoadingVets(false);
    }
  }, []);

  const loadServices = useCallback(async (clinicId: string) => {
    setLoadingServices(true);
    try {
      const data = await clinicManagerService.getServicesByClinic(clinicId);
      setServices(data);
      setStats((prev) => ({ ...prev, totalServices: data.length }));
    } catch (err) {
      console.error('[ClinicManagerPage] getServicesByClinic error:', err);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const loadVaccines = useCallback(async (clinicId: string) => {
    setLoadingVaccines(true);
    try {
      const data = await clinicManagerService.getVaccinesByClinic(clinicId);
      setVaccines(data);
      setStats((prev) => ({ ...prev, totalVaccines: data.length }));
    } catch (err) {
      console.error('[ClinicManagerPage] getVaccinesByClinic error:', err);
    } finally {
      setLoadingVaccines(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedClinic) return;
    loadVets(selectedClinic.id);
    loadServices(selectedClinic.id);
    loadVaccines(selectedClinic.id);
  }, [selectedClinic, loadVets, loadServices, loadVaccines]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveClinic = async (data: { name: string; address: string; phone: string }) => {
    if (!selectedClinic) return;
    setSaving(true);
    try {
      await clinicManagerService.updateClinic(selectedClinic.id, {
        ...data,
        clinicManagerId: selectedClinic.clinicManagerId,
      });
      setSelectedClinic((prev) => prev ? { ...prev, ...data } : prev);
      setClinics((prev) => prev.map((c) => (c.id === selectedClinic.id ? { ...c, ...data } : c)));
      setEditOpen(false);
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinic error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleService = async (serviceId: string, isAvailable: boolean, price: number) => {
    try {
      await clinicManagerService.updateClinicService(serviceId, { isAvailable, price });
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, isAvailable } : s)));
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinicService error:', err);
    }
  };

  const handleToggleVaccine = async (vaccineId: string, isAvailable: boolean, price: number) => {
    try {
      await clinicManagerService.updateClinicVaccine(vaccineId, { isAvailable, price });
      setVaccines((prev) => prev.map((v) => (v.id === vaccineId ? { ...v, isAvailable } : v)));
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinicVaccine error:', err);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loadingClinics) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Đang tải thông tin phòng khám...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorScreen}>{error}</div>;
  }

  if (!selectedClinic) {
    return (
      <div className={styles.emptyScreen}>
        <p className={styles.emptyText}>Bạn chưa được gán cho phòng khám nào.</p>
      </div>
    );
  }

  const tabs: { key: ClinicManagerTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Tổng quan', icon: '🏥' },
    { key: 'vets', label: 'Bác sĩ thú y', icon: '👨‍⚕️' },
    { key: 'services', label: 'Dịch vụ', icon: '🩺' },
    { key: 'vaccines', label: 'Vaccine', icon: '💉' },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lý phòng khám</h1>
          <p className={styles.subtitle}>{selectedClinic.name} — {selectedClinic.address}</p>
        </div>
        {clinics.length > 1 && (
          <select
            className={styles.clinicSelector}
            value={selectedClinic.id}
            onChange={(e) => {
              const found = clinics.find((c) => c.id === e.target.value);
              if (found) setSelectedClinic(found);
            }}
          >
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon="👨‍⚕️" label="Bác sĩ thú y" value={stats.totalVets} color="#dbeafe" />
        <StatCard icon="🩺" label="Dịch vụ" value={stats.totalServices} color="#dcfce7" />
        <StatCard icon="💉" label="Vaccine" value={stats.totalVaccines} color="#fef9c3" />
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        {tabs.map((t) => (
          <button
            key={t.key}
            className={activeTab === t.key ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <OverviewTab clinic={selectedClinic} onEditClick={() => setEditOpen(true)} />
        )}
        {activeTab === 'vets' && (
          <VetTable vets={vets} loading={loadingVets} />
        )}
        {activeTab === 'services' && (
          <ServiceTable services={services} loading={loadingServices} onToggle={handleToggleService} />
        )}
        {activeTab === 'vaccines' && (
          <VaccineTable vaccines={vaccines} loading={loadingVaccines} onToggle={handleToggleVaccine} />
        )}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditClinicModal
          clinic={selectedClinic}
          onSave={handleSaveClinic}
          onClose={() => setEditOpen(false)}
          saving={saving}
        />
      )}
    </div>
  );
}
