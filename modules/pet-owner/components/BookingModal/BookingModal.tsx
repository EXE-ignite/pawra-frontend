'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './BookingModal.module.scss';
import { BOOKING_STEPS, TIME_SLOTS } from '../../pages/Booking/BookingPage.types';
import type { BookingFormData } from '../../pages/Booking/BookingPage.types';
import { clinicService } from '../../services/clinic.service';
import { appointmentService } from '../../services/appointment.service';
import { petService } from '../../services/pet.service';
import type { ClinicDto, ClinicServiceDto, VeterinarianDto, ServiceDto } from '../../services/clinic.service';
import type { Pet } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultDate?: string; // YYYY-MM-DD, pre-fills from calendar click
}

const EMPTY_FORM: BookingFormData = {
  clinicId: '',
  clinicName: '',
  serviceId: '',
  serviceName: '',
  servicePrice: 0,
  veterinarianId: '',
  veterinarianName: '',
  petId: '',
  petName: '',
  appointmentDate: '',
  appointmentTime: '',
  notes: '',
};

export function BookingModal({ isOpen, onClose, onSuccess, defaultDate }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<BookingFormData>({ ...EMPTY_FORM, appointmentDate: defaultDate || '' });

  const [allServices, setAllServices] = useState<ServiceDto[]>([]);
  const [clinics, setClinics] = useState<ClinicDto[]>([]);
  const [services, setServices] = useState<ClinicServiceDto[]>([]);
  const [vets, setVets] = useState<VeterinarianDto[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset when modal opens or defaultDate changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setForm({ ...EMPTY_FORM, appointmentDate: defaultDate || '' });
      setSearchQuery('');
      setError('');
    }
  }, [isOpen, defaultDate]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Load all catalog services when modal opens
  useEffect(() => {
    if (!isOpen) return;
    async function loadAllServices() {
      setLoading(true);
      setError('');
      try {
        const data = await clinicService.getAllServices();
        setAllServices(data);
      } catch {
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    loadAllServices();
  }, [isOpen]);

  // Load clinics offering the chosen service
  useEffect(() => {
    if (!form.serviceId) return;
    async function loadClinicsForService() {
      setLoading(true);
      setError('');
      try {
        let data = await clinicService.searchByService(form.serviceName);
        if (!data.length) data = await clinicService.getAllClinics();
        setClinics(data);
      } catch {
        setError('Không thể tải danh sách phòng khám. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    loadClinicsForService();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.serviceId]);

  // Load clinic services (price lookup) + vets when clinic is chosen
  useEffect(() => {
    if (!form.clinicId) return;
    const serviceId = form.serviceId;
    async function loadClinicData() {
      setLoading(true);
      setError('');
      try {
        const [svcData, vetData] = await Promise.all([
          clinicService.getServicesByClinic(form.clinicId),
          clinicService.getVeterinariansByClinic(form.clinicId),
        ]);
        const available = svcData.filter(s => s.isAvailable);
        setServices(available);
        setVets(vetData);
        // Fill in the price for the selected service at this clinic
        const matched = available.find(s => s.serviceId === serviceId);
        if (matched) setForm(prev => ({ ...prev, servicePrice: matched.price }));
      } catch {
        setError('Không thể tải thông tin phòng khám. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    loadClinicData();
  }, [form.clinicId]);

  // Load pets when reaching step 4
  useEffect(() => {
    if (currentStep !== 4) return;
    async function loadPets() {
      setLoading(true);
      try {
        const data = await petService.getUserPets();
        setPets(data);
      } catch {
        setError('Không thể tải danh sách thú cưng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, [currentStep]);

  const filteredServices = allServices.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClinics = clinics.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectClinic(clinic: ClinicDto) {
    setSearchQuery('');
    setForm(prev => ({
      ...prev,
      clinicId: clinic.id,
      clinicName: clinic.name,
      veterinarianId: '',
      veterinarianName: '',
    }));
    setCurrentStep(3);
  }

  function selectService(svc: ServiceDto) {
    setSearchQuery('');
    setForm(prev => ({
      ...prev,
      serviceId: svc.id,
      serviceName: svc.name || '',
      servicePrice: 0,
      clinicId: '',
      clinicName: '',
      veterinarianId: '',
      veterinarianName: '',
    }));
    setCurrentStep(2);
  }

  function selectVet(vet: VeterinarianDto) {
    const name = vet.account?.fullName || vet.fullName || `Bác sĩ #${vet.id.slice(0, 6)}`;
    setForm(prev => ({ ...prev, veterinarianId: vet.id, veterinarianName: name }));
  }

  function selectPet(pet: Pet) {
    setForm(prev => ({ ...prev, petId: pet.id, petName: pet.name }));
  }

  function canProceedStep3() {
    return form.appointmentDate && form.appointmentTime;
  }

  const handleSubmit = useCallback(async () => {
    if (!form.petId) {
      setError('Vui lòng chọn thú cưng.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const appointmentDateTime = new Date(`${form.appointmentDate}T${form.appointmentTime}:00`);
      await appointmentService.createAppointment({
        petId: form.petId,
        veterinarianId: form.veterinarianId,
        clinicId: form.clinicId,
        appointmentTime: appointmentDateTime,
        serviceId: form.serviceId || undefined,
        notes: form.notes || undefined,
      });
      onSuccess();
      onClose();
    } catch {
      setError('Đặt lịch thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }, [form, onSuccess, onClose]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Đặt lịch khám</h2>
            <p className={styles.modalSubtitle}>Chọn phòng khám, dịch vụ và thời gian phù hợp cho thú cưng</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        {/* Stepper */}
        <div className={styles.stepper}>
          {BOOKING_STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <div className={`${styles.stepItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
                  <div className={styles.stepCircle}>
                    {isCompleted ? '✓' : step.id}
                  </div>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
                {idx < BOOKING_STEPS.length - 1 && (
                  <div className={`${styles.stepConnector} ${isCompleted ? styles.connectorCompleted : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <div className={styles.errorBanner}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className={styles.errorClose}>✕</button>
          </div>
        )}

        {/* Scrollable body */}
        <div className={styles.body}>

          {/* ── Step 1: Chọn dịch vụ ── */}
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Chọn dịch vụ</h3>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Tìm dịch vụ..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              {loading ? (
                <div className={styles.loadingState}>Đang tải danh sách dịch vụ...</div>
              ) : filteredServices.length === 0 ? (
                <div className={styles.emptyState}><p>Không tìm thấy dịch vụ phù hợp.</p></div>
              ) : (
                <div className={styles.serviceGrid}>
                  {filteredServices.map(svc => (
                    <button
                      key={svc.id}
                      className={`${styles.serviceCard} ${form.serviceId === svc.id ? styles.selected : ''}`}
                      onClick={() => selectService(svc)}
                    >
                      <div className={styles.serviceImageSlot}>
                        {svc.imageUrl
                          ? <img src={svc.imageUrl} alt={svc.name} />
                          : <span className={styles.servicePlaceholder}>🩺</span>}
                      </div>
                      <div className={styles.serviceInfo}>
                        <h4 className={styles.serviceName}>{svc.name}</h4>
                        {svc.description && <p className={styles.serviceDesc}>{svc.description}</p>}
                      </div>
                      <div className={styles.selectBadge}>Chọn →</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Chọn phòng khám ── */}
          {currentStep === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.stepNav}>
                <button className={styles.backBtn} onClick={() => { setSearchQuery(''); setCurrentStep(1); }}>← Quay lại</button>
                <h3 className={styles.stepTitle}>Phòng khám — {form.serviceName}</h3>
              </div>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Tìm phòng khám theo tên hoặc địa chỉ..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              {loading ? (
                <div className={styles.loadingState}>Đang tải danh sách phòng khám...</div>
              ) : filteredClinics.length === 0 ? (
                <div className={styles.emptyState}><p>Không tìm thấy phòng khám nào có dịch vụ này.</p></div>
              ) : (
                <div className={styles.clinicGrid}>
                  {filteredClinics.map(clinic => (
                    <button
                      key={clinic.id}
                      className={`${styles.clinicCard} ${form.clinicId === clinic.id ? styles.selected : ''}`}
                      onClick={() => selectClinic(clinic)}
                    >
                      <div className={styles.clinicImage}>
                        {clinic.imageUrl
                          ? <img src={clinic.imageUrl} alt={clinic.name} />
                          : <span className={styles.clinicPlaceholder}>🏥</span>}
                      </div>
                      <div className={styles.clinicInfo}>
                        <h4 className={styles.clinicName}>{clinic.name}</h4>
                        {clinic.address && <p className={styles.clinicAddress}>📍 {clinic.address}</p>}
                        {clinic.phone && <p className={styles.clinicPhone}>📞 {clinic.phone}</p>}
                      </div>
                      <div className={styles.selectBadge}>Chọn →</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Bác sĩ & Thời gian ── */}
          {currentStep === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.stepNav}>
                <button className={styles.backBtn} onClick={() => setCurrentStep(2)}>← Quay lại</button>
                <h3 className={styles.stepTitle}>Bác sĩ & Thời gian</h3>
              </div>
              <div className={styles.step3Layout}>
                <section className={styles.subSection}>
                  <h4 className={styles.subSectionTitle}>Chọn bác sĩ</h4>
                  {loading ? (
                    <div className={styles.loadingState}>Đang tải...</div>
                  ) : vets.length === 0 ? (
                    <div className={styles.emptyState}><p>Hiện không có bác sĩ khả dụng tại phòng khám này.</p></div>
                  ) : (
                    <div className={styles.vetList}>
                      {vets.map(vet => {
                        const name = vet.account?.fullName || vet.fullName || `Bác sĩ #${vet.id.slice(0, 6)}`;
                        return (
                          <button
                            key={vet.id}
                            className={`${styles.vetCard} ${form.veterinarianId === vet.id ? styles.selected : ''}`}
                            onClick={() => selectVet(vet)}
                          >
                            <div className={styles.vetAvatar}>
                              {vet.account?.avatarUrl
                                ? <img src={vet.account.avatarUrl} alt={name} />
                                : <span>👨‍⚕️</span>}
                            </div>
                            <div className={styles.vetInfo}>
                              <strong>{name}</strong>
                              {vet.licenseNumber && <span className={styles.vetLicense}>#{vet.licenseNumber}</span>}
                            </div>
                            {form.veterinarianId === vet.id && <span className={styles.checkmark}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className={styles.subSection}>
                  <h4 className={styles.subSectionTitle}>Ngày hẹn</h4>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={form.appointmentDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  />
                  {form.appointmentDate && (
                    <>
                      <h4 className={`${styles.subSectionTitle} ${styles.mt}`}>Giờ hẹn</h4>
                      <div className={styles.timeSlotGrid}>
                        {TIME_SLOTS.map(slot => (
                          <button
                            key={slot}
                            className={`${styles.timeSlot} ${form.appointmentTime === slot ? styles.selected : ''}`}
                            onClick={() => setForm(prev => ({ ...prev, appointmentTime: slot }))}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <h4 className={`${styles.subSectionTitle} ${styles.mt}`}>Ghi chú (tùy chọn)</h4>
                  <textarea
                    className={styles.notesInput}
                    placeholder="Thêm ghi chú cho bác sĩ..."
                    value={form.notes}
                    rows={3}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </section>
              </div>
              <div className={styles.stepActions}>
                <button
                  className={styles.btnPrimary}
                  disabled={!canProceedStep3()}
                  onClick={() => setCurrentStep(4)}
                >
                  Tiếp theo →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Chọn thú cưng & Xác nhận ── */}
          {currentStep === 4 && (
            <div className={styles.stepContent}>
              <div className={styles.stepNav}>
                <button className={styles.backBtn} onClick={() => setCurrentStep(3)}>← Quay lại</button>
                <h3 className={styles.stepTitle}>Xác nhận đặt lịch</h3>
              </div>

              <div className={styles.summaryCard}>
                <h4 className={styles.summaryTitle}>Thông tin đặt lịch</h4>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>🏥 Phòng khám</span>
                    <span className={styles.summaryValue}>{form.clinicName}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>🩺 Dịch vụ</span>
                    <span className={styles.summaryValue}>{form.serviceName}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>👨‍⚕️ Bác sĩ</span>
                    <span className={styles.summaryValue}>{form.veterinarianName || 'Sẽ được phân công'}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>📅 Ngày & Giờ</span>
                    <span className={styles.summaryValue}>
                      {new Date(`${form.appointmentDate}T${form.appointmentTime}`).toLocaleString('vi-VN', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {form.servicePrice > 0 && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>💰 Chi phí</span>
                      <span className={`${styles.summaryValue} ${styles.price}`}>
                        {form.servicePrice.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  )}
                  {form.notes && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>📝 Ghi chú</span>
                      <span className={styles.summaryValue}>{form.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.petSection}>
                <h4 className={styles.subSectionTitle}>Chọn thú cưng</h4>
                {loading ? (
                  <div className={styles.loadingState}>Đang tải danh sách thú cưng...</div>
                ) : pets.length === 0 ? (
                  <div className={styles.emptyState}><p>Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước.</p></div>
                ) : (
                  <div className={styles.petList}>
                    {pets.map(pet => (
                      <button
                        key={pet.id}
                        className={`${styles.petCard} ${form.petId === pet.id ? styles.selected : ''}`}
                        onClick={() => selectPet(pet)}
                      >
                        <div className={styles.petAvatar}>
                          {pet.imageUrl
                            ? <img src={pet.imageUrl} alt={pet.name} />
                            : <span>{pet.species?.toLowerCase() === 'cat' ? '🐱' : '🐶'}</span>}
                        </div>
                        <div className={styles.petInfo}>
                          <strong>{pet.name}</strong>
                          <span>{pet.species} · {pet.breed}</span>
                        </div>
                        {form.petId === pet.id && <span className={styles.checkmark}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.stepActions}>
                <button
                  className={styles.btnPrimary}
                  disabled={!form.petId || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Đang đặt lịch...' : '✅ Xác nhận đặt lịch'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
