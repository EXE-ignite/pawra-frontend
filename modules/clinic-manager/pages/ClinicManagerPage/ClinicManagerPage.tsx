'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

// ─── Confirm Delete Modal ────────────────────────────────────────────────────

interface ConfirmDeleteModalProps {
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  deleting: boolean;
}

function ConfirmDeleteModal({ message, onConfirm, onClose, deleting }: ConfirmDeleteModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.modalSm}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Xác nhận xóa</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <p className={styles.confirmText}>{message}</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={deleting}>Hủy</button>
          <button className={styles.deleteConfirmBtn} onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Clinic Overview ────────────────────────────────────────────────────

interface OverviewTabProps {
  clinic: Clinic;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onAddClick: () => void;
}

function OverviewTab({ clinic, onEditClick, onDeleteClick, onAddClick }: OverviewTabProps) {
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
          <div className={styles.actionBtns}>
            <button className={styles.addBtn} onClick={onAddClick}>+ Thêm phòng khám</button>
            <button className={styles.editBtn} onClick={onEditClick}>✏️ Chỉnh sửa</button>
            <button className={styles.deleteBtn} onClick={onDeleteClick}>🗑️ Xóa</button>
          </div>
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

// ─── Clinic Form Modal (Create + Edit) ────────────────────────────────────────

interface ClinicFormModalProps {
  initial?: Clinic | null;
  onSave: (data: { name: string; address: string; phone: string; imageUrl: string }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

function ClinicFormModal({ initial, onSave, onClose, saving }: ClinicFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ name, address, phone, imageUrl });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {initial ? 'Chỉnh sửa phòng khám' : 'Thêm phòng khám mới'}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tên phòng khám *</label>
            <input className={styles.formInput} value={name} onChange={(e) => setName(e.target.value)} required disabled={saving} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Địa chỉ *</label>
            <input className={styles.formInput} value={address} onChange={(e) => setAddress(e.target.value)} required disabled={saving} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số điện thoại *</label>
            <input className={styles.formInput} value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={saving} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>URL ảnh</label>
            <input className={styles.formInput} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={saving} placeholder="https://..." />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>Hủy</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tab: Vets ───────────────────────────────────────────────────────────────

interface VetTableProps {
  vets: Veterinarian[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (vet: Veterinarian) => void;
  onDelete: (vet: Veterinarian) => void;
}

function VetTable({ vets, loading, onAdd, onEdit, onDelete }: VetTableProps) {
  if (loading) return <div className={styles.loadingRow}>Đang tải bác sĩ...</div>;

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionCount}>{vets.length} bác sĩ</span>
        <button className={styles.addBtn} onClick={onAdd}>+ Thêm bác sĩ</button>
      </div>
      {vets.length === 0 ? (
        <div className={styles.emptyRow}>Chưa có bác sĩ nào.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số giấy phép</th>
                <th>Ngày tham gia</th>
                <th>Hành động</th>
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
                  <td>
                    <div className={styles.rowActions}>
                      <button className={styles.editRowBtn} onClick={() => onEdit(v)}>✏️</button>
                      <button className={styles.deleteRowBtn} onClick={() => onDelete(v)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Vet Form Modal ───────────────────────────────────────────────────────────

interface VetFormModalProps {
  initial?: Veterinarian | null;
  clinicId: string;
  onSave: (data: { accountId?: string; clinicId: string; licenseNumber: string }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

function VetFormModal({ initial, clinicId, onSave, onClose, saving }: VetFormModalProps) {
  const [accountId, setAccountId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState(initial?.licenseNumber ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      await onSave({ clinicId, licenseNumber });
    } else {
      await onSave({ accountId, clinicId, licenseNumber });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{initial ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {!initial && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Account ID (UUID) *</label>
              <input
                className={styles.formInput}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
                disabled={saving}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số giấy phép hành nghề *</label>
            <input
              className={styles.formInput}
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>Hủy</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tab: Services ───────────────────────────────────────────────────────────

interface ServiceTableProps {
  services: ClinicService[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (s: ClinicService) => void;
  onDelete: (s: ClinicService) => void;
  onToggle: (id: string, isAvailable: boolean, price: number) => void;
}

function ServiceTable({ services, loading, onAdd, onEdit, onDelete, onToggle }: ServiceTableProps) {
  if (loading) return <div className={styles.loadingRow}>Đang tải dịch vụ...</div>;

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionCount}>{services.length} dịch vụ</span>
        <button className={styles.addBtn} onClick={onAdd}>+ Thêm dịch vụ</button>
      </div>
      {services.length === 0 ? (
        <div className={styles.emptyRow}>Chưa có dịch vụ nào.</div>
      ) : (
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
                    <div className={styles.rowActions}>
                      <button
                        className={s.isAvailable ? styles.deactivateBtn : styles.activateBtn}
                        onClick={() => onToggle(s.id, !s.isAvailable, s.price)}
                      >
                        {s.isAvailable ? 'Ngưng' : 'Kích hoạt'}
                      </button>
                      <button className={styles.editRowBtn} onClick={() => onEdit(s)}>✏️</button>
                      <button className={styles.deleteRowBtn} onClick={() => onDelete(s)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Service Form Modal ───────────────────────────────────────────────────────

interface MasterService { id: string; name: string | null; description: string | null; imageUrl: string | null }

interface ServiceFormModalProps {
  initial?: ClinicService | null;
  clinicId: string;
  masterServices: MasterService[];
  onSave: (data: { serviceId?: string; price: number; isAvailable: boolean }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

function ServiceFormModal({ initial, clinicId: _clinicId, masterServices, onSave, onClose, saving }: ServiceFormModalProps) {
  const [serviceId, setServiceId] = useState(masterServices[0]?.id ?? '');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [isAvailable, setIsAvailable] = useState(initial?.isAvailable ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      await onSave({ price, isAvailable });
    } else {
      await onSave({ serviceId, price, isAvailable });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{initial ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {!initial && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Dịch vụ *</label>
              <select className={styles.formInput} value={serviceId} onChange={(e) => setServiceId(e.target.value)} required disabled={saving}>
                {masterServices.map((s) => (
                  <option key={s.id} value={s.id}>{s.name ?? s.id}</option>
                ))}
              </select>
            </div>
          )}
          {initial && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Dịch vụ</label>
              <input className={styles.formInput} value={initial.serviceName ?? ''} disabled />
            </div>
          )}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Giá (VNĐ) *</label>
            <input
              className={styles.formInput}
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              disabled={saving}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formCheckLabel}>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                disabled={saving}
              />
              Hoạt động
            </label>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>Hủy</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tab: Vaccines ───────────────────────────────────────────────────────────

interface VaccineTableProps {
  vaccines: ClinicVaccine[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (v: ClinicVaccine) => void;
  onDelete: (v: ClinicVaccine) => void;
  onToggle: (id: string, isAvailable: boolean, price: number) => void;
}

function VaccineTable({ vaccines, loading, onAdd, onEdit, onDelete, onToggle }: VaccineTableProps) {
  if (loading) return <div className={styles.loadingRow}>Đang tải vaccine...</div>;

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionCount}>{vaccines.length} vaccine</span>
        <button className={styles.addBtn} onClick={onAdd}>+ Thêm vaccine</button>
      </div>
      {vaccines.length === 0 ? (
        <div className={styles.emptyRow}>Chưa có vaccine nào.</div>
      ) : (
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
                    <div className={styles.rowActions}>
                      <button
                        className={v.isAvailable ? styles.deactivateBtn : styles.activateBtn}
                        onClick={() => onToggle(v.id, !v.isAvailable, v.price)}
                      >
                        {v.isAvailable ? 'Ngưng' : 'Kích hoạt'}
                      </button>
                      <button className={styles.editRowBtn} onClick={() => onEdit(v)}>✏️</button>
                      <button className={styles.deleteRowBtn} onClick={() => onDelete(v)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Vaccine Form Modal ───────────────────────────────────────────────────────

interface MasterVaccine { id: string; name: string | null; manufacturer: string | null }

interface VaccineFormModalProps {
  initial?: ClinicVaccine | null;
  clinicId: string;
  masterVaccines: MasterVaccine[];
  onSave: (data: { vaccineId?: string; price: number; isAvailable: boolean }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

function VaccineFormModal({ initial, clinicId: _clinicId, masterVaccines, onSave, onClose, saving }: VaccineFormModalProps) {
  const [vaccineId, setVaccineId] = useState(masterVaccines[0]?.id ?? '');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [isAvailable, setIsAvailable] = useState(initial?.isAvailable ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      await onSave({ price, isAvailable });
    } else {
      await onSave({ vaccineId, price, isAvailable });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{initial ? 'Chỉnh sửa vaccine' : 'Thêm vaccine'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {!initial && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Vaccine *</label>
              <select className={styles.formInput} value={vaccineId} onChange={(e) => setVaccineId(e.target.value)} required disabled={saving}>
                {masterVaccines.map((v) => (
                  <option key={v.id} value={v.id}>{v.name ?? v.id} {v.manufacturer ? `(${v.manufacturer})` : ''}</option>
                ))}
              </select>
            </div>
          )}
          {initial && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Vaccine</label>
              <input className={styles.formInput} value={initial.vaccineName ?? ''} disabled />
            </div>
          )}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Giá (VNĐ) *</label>
            <input
              className={styles.formInput}
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              disabled={saving}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formCheckLabel}>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                disabled={saving}
              />
              Hoạt động
            </label>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>Hủy</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Thêm mới'}
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

  // ── Data ───────────────────────────────────────────────────────────────────
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [services, setServices] = useState<ClinicService[]>([]);
  const [vaccines, setVaccines] = useState<ClinicVaccine[]>([]);
  const [masterServices, setMasterServices] = useState<MasterService[]>([]);
  const [masterVaccines, setMasterVaccines] = useState<MasterVaccine[]>([]);
  const [stats, setStats] = useState<ClinicStats>({ totalVets: 0, totalServices: 0, totalVaccines: 0 });
  const [activeTab, setActiveTab] = useState<ClinicManagerTab>('overview');

  // ── Loading / Error ────────────────────────────────────────────────────────
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingVets, setLoadingVets] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Modal state ────────────────────────────────────────────────────────────
  type Modal =
    | { type: 'clinicCreate' }
    | { type: 'clinicEdit' }
    | { type: 'clinicDelete' }
    | { type: 'vetAdd' }
    | { type: 'vetEdit'; vet: Veterinarian }
    | { type: 'vetDelete'; vet: Veterinarian }
    | { type: 'serviceAdd' }
    | { type: 'serviceEdit'; service: ClinicService }
    | { type: 'serviceDelete'; service: ClinicService }
    | { type: 'vaccineAdd' }
    | { type: 'vaccineEdit'; vaccine: ClinicVaccine }
    | { type: 'vaccineDelete'; vaccine: ClinicVaccine };

  const [modal, setModal] = useState<Modal | null>(null);
  const closeModal = () => setModal(null);

  // Stable ref so callbacks don't go stale
  const selectedClinicRef = useRef<Clinic | null>(null);
  selectedClinicRef.current = selectedClinic;

  // ── Initial: load clinics + master lists ──────────────────────────────────
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoadingClinics(true);
        const [list, svc, vac] = await Promise.all([
          clinicManagerService.getClinics(),
          clinicManagerService.getMasterServices(),
          clinicManagerService.getMasterVaccines(),
        ]);
        setClinics(list);
        setMasterServices(svc);
        setMasterVaccines(vac);
        if (list.length > 0) setSelectedClinic(list[0]);
      } catch (err: unknown) {
        const msg = err && typeof err === 'object'
          ? ((err as Record<string, unknown>).message as string) || JSON.stringify(err)
          : String(err);
        console.error('[ClinicManagerPage] getClinics error:', msg);
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

  // ── Clinic Handlers ────────────────────────────────────────────────────────
  const handleCreateClinic = async (data: { name: string; address: string; phone: string; imageUrl: string }) => {
    const clinic = selectedClinicRef.current;
    if (!clinic) return;
    setSaving(true);
    try {
      const created = await clinicManagerService.createClinic({
        ...data,
        clinicManagerId: clinic.clinicManagerId,
      });
      setClinics((prev) => [...prev, created]);
      setSelectedClinic(created);
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] createClinic error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateClinic = async (data: { name: string; address: string; phone: string; imageUrl: string }) => {
    const clinic = selectedClinicRef.current;
    if (!clinic) return;
    setSaving(true);
    try {
      await clinicManagerService.updateClinic(clinic.id, {
        ...data,
        clinicManagerId: clinic.clinicManagerId,
      });
      const updated = { ...clinic, ...data };
      setSelectedClinic(updated);
      setClinics((prev) => prev.map((c) => (c.id === clinic.id ? updated : c)));
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinic error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClinic = async () => {
    const clinic = selectedClinicRef.current;
    if (!clinic) return;
    setSaving(true);
    try {
      await clinicManagerService.deleteClinic(clinic.id);
      const remaining = clinics.filter((c) => c.id !== clinic.id);
      setClinics(remaining);
      setSelectedClinic(remaining[0] ?? null);
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] deleteClinic error:', err);
    } finally {
      setSaving(false);
    }
  };

  // ── Vet Handlers ──────────────────────────────────────────────────────────
  const handleCreateVet = async (data: { accountId?: string; clinicId: string; licenseNumber: string }) => {
    setSaving(true);
    try {
      await clinicManagerService.createVet({
        accountId: data.accountId!,
        clinicId: data.clinicId,
        licenseNumber: data.licenseNumber,
      });
      if (selectedClinic) await loadVets(selectedClinic.id);
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] createVet error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateVet = async (vetId: string, data: { accountId?: string; clinicId: string; licenseNumber: string }) => {
    setSaving(true);
    try {
      await clinicManagerService.updateVet(vetId, { clinicId: data.clinicId, licenseNumber: data.licenseNumber });
      setVets((prev) => prev.map((v) => (v.id === vetId ? { ...v, licenseNumber: data.licenseNumber } : v)));
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] updateVet error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVet = async (vetId: string) => {
    setSaving(true);
    try {
      await clinicManagerService.deleteVet(vetId);
      setVets((prev) => prev.filter((v) => v.id !== vetId));
      setStats((prev) => ({ ...prev, totalVets: prev.totalVets - 1 }));
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] deleteVet error:', err);
    } finally {
      setSaving(false);
    }
  };

  // ── Service Handlers ──────────────────────────────────────────────────────
  const handleToggleService = async (serviceId: string, isAvailable: boolean, price: number) => {
    try {
      await clinicManagerService.updateClinicService(serviceId, { isAvailable, price });
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, isAvailable } : s)));
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinicService error:', err);
    }
  };

  const handleCreateService = async (data: { serviceId?: string; price: number; isAvailable: boolean }) => {
    const clinic = selectedClinicRef.current;
    if (!clinic || !data.serviceId) return;
    setSaving(true);
    try {
      await clinicManagerService.createClinicService({
        clinicId: clinic.id,
        serviceId: data.serviceId,
        price: data.price,
        isAvailable: data.isAvailable,
      });
      await loadServices(clinic.id);
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] createClinicService error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async (serviceId: string, data: { serviceId?: string; price: number; isAvailable: boolean }) => {
    setSaving(true);
    try {
      await clinicManagerService.updateClinicService(serviceId, { price: data.price, isAvailable: data.isAvailable });
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, price: data.price, isAvailable: data.isAvailable } : s)));
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinicService error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setSaving(true);
    try {
      await clinicManagerService.deleteClinicService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      setStats((prev) => ({ ...prev, totalServices: prev.totalServices - 1 }));
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] deleteClinicService error:', err);
    } finally {
      setSaving(false);
    }
  };

  // ── Vaccine Handlers ──────────────────────────────────────────────────────
  const handleToggleVaccine = async (vaccineId: string, isAvailable: boolean, price: number) => {
    try {
      await clinicManagerService.updateClinicVaccine(vaccineId, { isAvailable, price });
      setVaccines((prev) => prev.map((v) => (v.id === vaccineId ? { ...v, isAvailable } : v)));
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinicVaccine error:', err);
    }
  };

  const handleCreateVaccine = async (data: { vaccineId?: string; price: number; isAvailable: boolean }) => {
    const clinic = selectedClinicRef.current;
    if (!clinic || !data.vaccineId) return;
    setSaving(true);
    try {
      await clinicManagerService.createClinicVaccine({
        clinicId: clinic.id,
        vaccineId: data.vaccineId,
        price: data.price,
        isAvailable: data.isAvailable,
      });
      await loadVaccines(clinic.id);
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] createClinicVaccine error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateVaccine = async (vaccineRecordId: string, data: { vaccineId?: string; price: number; isAvailable: boolean }) => {
    setSaving(true);
    try {
      await clinicManagerService.updateClinicVaccine(vaccineRecordId, { price: data.price, isAvailable: data.isAvailable });
      setVaccines((prev) => prev.map((v) => (v.id === vaccineRecordId ? { ...v, price: data.price, isAvailable: data.isAvailable } : v)));
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] updateClinicVaccine error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVaccine = async (vaccineRecordId: string) => {
    setSaving(true);
    try {
      await clinicManagerService.deleteClinicVaccine(vaccineRecordId);
      setVaccines((prev) => prev.filter((v) => v.id !== vaccineRecordId));
      setStats((prev) => ({ ...prev, totalVaccines: prev.totalVaccines - 1 }));
      closeModal();
    } catch (err) {
      console.error('[ClinicManagerPage] deleteClinicVaccine error:', err);
    } finally {
      setSaving(false);
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
          <OverviewTab
            clinic={selectedClinic}
            onEditClick={() => setModal({ type: 'clinicEdit' })}
            onDeleteClick={() => setModal({ type: 'clinicDelete' })}
            onAddClick={() => setModal({ type: 'clinicCreate' })}
          />
        )}
        {activeTab === 'vets' && (
          <VetTable
            vets={vets}
            loading={loadingVets}
            onAdd={() => setModal({ type: 'vetAdd' })}
            onEdit={(vet) => setModal({ type: 'vetEdit', vet })}
            onDelete={(vet) => setModal({ type: 'vetDelete', vet })}
          />
        )}
        {activeTab === 'services' && (
          <ServiceTable
            services={services}
            loading={loadingServices}
            onAdd={() => setModal({ type: 'serviceAdd' })}
            onEdit={(service) => setModal({ type: 'serviceEdit', service })}
            onDelete={(service) => setModal({ type: 'serviceDelete', service })}
            onToggle={handleToggleService}
          />
        )}
        {activeTab === 'vaccines' && (
          <VaccineTable
            vaccines={vaccines}
            loading={loadingVaccines}
            onAdd={() => setModal({ type: 'vaccineAdd' })}
            onEdit={(vaccine) => setModal({ type: 'vaccineEdit', vaccine })}
            onDelete={(vaccine) => setModal({ type: 'vaccineDelete', vaccine })}
            onToggle={handleToggleVaccine}
          />
        )}
      </div>

      {/* ── Modals ── */}

      {/* Clinic create */}
      {modal?.type === 'clinicCreate' && (
        <ClinicFormModal initial={null} onSave={handleCreateClinic} onClose={closeModal} saving={saving} />
      )}

      {/* Clinic edit */}
      {modal?.type === 'clinicEdit' && (
        <ClinicFormModal initial={selectedClinic} onSave={handleUpdateClinic} onClose={closeModal} saving={saving} />
      )}

      {/* Clinic delete */}
      {modal?.type === 'clinicDelete' && (
        <ConfirmDeleteModal
          message={`Bạn có chắc muốn xóa phòng khám "${selectedClinic.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDeleteClinic}
          onClose={closeModal}
          deleting={saving}
        />
      )}

      {/* Vet add */}
      {modal?.type === 'vetAdd' && selectedClinic && (
        <VetFormModal initial={null} clinicId={selectedClinic.id} onSave={handleCreateVet} onClose={closeModal} saving={saving} />
      )}

      {/* Vet edit */}
      {modal?.type === 'vetEdit' && selectedClinic && (
        <VetFormModal
          initial={modal.vet}
          clinicId={selectedClinic.id}
          onSave={(data) => handleUpdateVet(modal.vet.id, data)}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {/* Vet delete */}
      {modal?.type === 'vetDelete' && (
        <ConfirmDeleteModal
          message={`Bạn có chắc muốn xóa bác sĩ "${modal.vet.fullName ?? modal.vet.accountId}"?`}
          onConfirm={() => handleDeleteVet(modal.vet.id)}
          onClose={closeModal}
          deleting={saving}
        />
      )}

      {/* Service add */}
      {modal?.type === 'serviceAdd' && selectedClinic && (
        <ServiceFormModal
          initial={null}
          clinicId={selectedClinic.id}
          masterServices={masterServices}
          onSave={handleCreateService}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {/* Service edit */}
      {modal?.type === 'serviceEdit' && selectedClinic && (
        <ServiceFormModal
          initial={modal.service}
          clinicId={selectedClinic.id}
          masterServices={masterServices}
          onSave={(data) => handleUpdateService(modal.service.id, data)}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {/* Service delete */}
      {modal?.type === 'serviceDelete' && (
        <ConfirmDeleteModal
          message={`Bạn có chắc muốn xóa dịch vụ "${modal.service.serviceName ?? modal.service.id}"?`}
          onConfirm={() => handleDeleteService(modal.service.id)}
          onClose={closeModal}
          deleting={saving}
        />
      )}

      {/* Vaccine add */}
      {modal?.type === 'vaccineAdd' && selectedClinic && (
        <VaccineFormModal
          initial={null}
          clinicId={selectedClinic.id}
          masterVaccines={masterVaccines}
          onSave={handleCreateVaccine}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {/* Vaccine edit */}
      {modal?.type === 'vaccineEdit' && selectedClinic && (
        <VaccineFormModal
          initial={modal.vaccine}
          clinicId={selectedClinic.id}
          masterVaccines={masterVaccines}
          onSave={(data) => handleUpdateVaccine(modal.vaccine.id, data)}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {/* Vaccine delete */}
      {modal?.type === 'vaccineDelete' && (
        <ConfirmDeleteModal
          message={`Bạn có chắc muốn xóa vaccine "${modal.vaccine.vaccineName ?? modal.vaccine.id}"?`}
          onConfirm={() => handleDeleteVaccine(modal.vaccine.id)}
          onClose={closeModal}
          deleting={saving}
        />
      )}
    </div>
  );
}
