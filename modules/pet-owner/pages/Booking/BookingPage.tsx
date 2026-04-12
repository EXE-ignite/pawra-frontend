'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './BookingPage.module.scss';
import { BOOKING_STEPS, TIME_SLOTS } from './BookingPage.types';
import type { BookingFormData } from './BookingPage.types';
import { clinicService } from '../../services/clinic.service';
import { appointmentService } from '../../services/appointment.service';
import { petService } from '../../services/pet.service';
import type { ClinicDto, ClinicServiceDto, VeterinarianDto } from '../../services/clinic.service';
import type { Pet } from '../../types';

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

export function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);

  // Data from API
  const [clinics, setClinics] = useState<ClinicDto[]>([]);
  const [services, setServices] = useState<ClinicServiceDto[]>([]);
  const [vets, setVets] = useState<VeterinarianDto[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load clinics on mount
  useEffect(() => {
    async function loadClinics() {
      setLoading(true);
      setError('');
      try {
        const data = await clinicService.getAllClinics();
        setClinics(data);
      } catch {
        setError('Không thể tải danh sách phòng khám. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    loadClinics();
  }, []);

  // Load services + vets when clinic chosen
  useEffect(() => {
    if (!form.clinicId) return;

    async function loadClinicData() {
      setLoading(true);
      setError('');
      try {
        const [svcData, vetData] = await Promise.all([
          clinicService.getServicesByClinic(form.clinicId),
          clinicService.getVeterinariansByClinic(form.clinicId),
        ]);
        setServices(svcData.filter(s => s.isAvailable));
        setVets(vetData);
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

  const filteredClinics = clinics.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectClinic(clinic: ClinicDto) {
    setForm(prev => ({
      ...prev,
      clinicId: clinic.id,
      clinicName: clinic.name,
      serviceId: '',
      serviceName: '',
      servicePrice: 0,
      veterinarianId: '',
      veterinarianName: '',
    }));
    setCurrentStep(2);
  }

  function selectService(svc: ClinicServiceDto) {
    setForm(prev => ({
      ...prev,
      serviceId: svc.serviceId,
      serviceName: svc.serviceName || '',
      servicePrice: svc.price,
    }));
    setCurrentStep(3);
  }

  function selectVet(vet: VeterinarianDto) {
    const name = vet.account?.fullName || vet.fullName || `Bác sĩ #${vet.id.slice(0, 6)}`;
    setForm(prev => ({ ...prev, veterinarianId: vet.id, veterinarianName: name }));
  }

  function selectPet(pet: Pet) {
    setForm(prev => ({ ...prev, petId: pet.id, petName: pet.name }));
  }

  function canProceedStep3() {
    return form.veterinarianId && form.appointmentDate && form.appointmentTime;
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
      });
      setSuccess(true);
    } catch {
      setError('Đặt lịch thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  function handleReset() {
    setForm(EMPTY_FORM);
    setCurrentStep(1);
    setSuccess(false);
    setError('');
  }

  if (success) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Đặt lịch thành công!</h2>
          <p className={styles.successText}>
            Lịch hẹn của <strong>{form.petName}</strong> tại <strong>{form.clinicName}</strong> đã được đặt vào{' '}
            <strong>
              {new Date(`${form.appointmentDate}T${form.appointmentTime}`).toLocaleString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </strong>.
          </p>
          <button className={styles.btnPrimary} onClick={handleReset}>
            Đặt lịch mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Đặt lịch khám</h1>
        <p className={styles.subtitle}>Chọn phòng khám, dịch vụ và thời gian phù hợp cho thú cưng của bạn</p>
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

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className={styles.errorClose}>✕</button>
        </div>
      )}

      {/* Step 1: Choose Clinic */}
      {currentStep === 1 && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepTitle}>Chọn phòng khám</h2>
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
            <div className={styles.emptyState}>
              <p>Không tìm thấy phòng khám phù hợp.</p>
            </div>
          ) : (
            <div className={styles.clinicGrid}>
              {filteredClinics.map(clinic => (
                <button
                  key={clinic.id}
                  className={`${styles.clinicCard} ${form.clinicId === clinic.id ? styles.selected : ''}`}
                  onClick={() => selectClinic(clinic)}
                >
                  <div className={styles.clinicImage}>
                    {clinic.imageUrl ? (
                      <img src={clinic.imageUrl} alt={clinic.name} />
                    ) : (
                      <span className={styles.clinicPlaceholder}>🏥</span>
                    )}
                  </div>
                  <div className={styles.clinicInfo}>
                    <h3 className={styles.clinicName}>{clinic.name}</h3>
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

      {/* Step 2: Choose Service */}
      {currentStep === 2 && (
        <div className={styles.stepContent}>
          <div className={styles.stepNav}>
            <button className={styles.backBtn} onClick={() => setCurrentStep(1)}>
              ← Quay lại
            </button>
            <h2 className={styles.stepTitle}>Chọn dịch vụ — {form.clinicName}</h2>
          </div>
          {loading ? (
            <div className={styles.loadingState}>Đang tải dịch vụ...</div>
          ) : services.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Phòng khám này chưa có dịch vụ khả dụng.</p>
            </div>
          ) : (
            <div className={styles.serviceGrid}>
              {services.map(svc => (
                <button
                  key={svc.id}
                  className={`${styles.serviceCard} ${form.serviceId === svc.serviceId ? styles.selected : ''}`}
                  onClick={() => selectService(svc)}
                >
                  <div className={styles.serviceImageSlot}>
                    {svc.serviceImageUrl ? (
                      <img src={svc.serviceImageUrl} alt={svc.serviceName} />
                    ) : (
                      <span className={styles.servicePlaceholder}>🩺</span>
                    )}
                  </div>
                  <div className={styles.serviceInfo}>
                    <h3 className={styles.serviceName}>{svc.serviceName || 'Dịch vụ'}</h3>
                    {svc.serviceDescription && (
                      <p className={styles.serviceDesc}>{svc.serviceDescription}</p>
                    )}
                    <span className={styles.servicePrice}>
                      {svc.price.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Choose Vet + Date/Time */}
      {currentStep === 3 && (
        <div className={styles.stepContent}>
          <div className={styles.stepNav}>
            <button className={styles.backBtn} onClick={() => setCurrentStep(2)}>
              ← Quay lại
            </button>
            <h2 className={styles.stepTitle}>Chọn bác sĩ & thời gian</h2>
          </div>

          <div className={styles.step3Layout}>
            {/* Vet selection */}
            <section className={styles.subSection}>
              <h3 className={styles.subSectionTitle}>Bác sĩ</h3>
              {loading ? (
                <div className={styles.loadingState}>Đang tải danh sách bác sĩ...</div>
              ) : vets.length === 0 ? (
                <div className={styles.emptyState}><p>Không có bác sĩ nào tại phòng khám này.</p></div>
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
                          {vet.account?.avatarUrl ? (
                            <img src={vet.account.avatarUrl} alt={name} />
                          ) : (
                            <span>👨‍⚕️</span>
                          )}
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

            {/* Date & Time */}
            <section className={styles.subSection}>
              <h3 className={styles.subSectionTitle}>Ngày hẹn</h3>
              <input
                type="date"
                className={styles.dateInput}
                value={form.appointmentDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
              />

              {form.appointmentDate && (
                <>
                  <h3 className={`${styles.subSectionTitle} ${styles.mt}`}>Giờ hẹn</h3>
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

              <h3 className={`${styles.subSectionTitle} ${styles.mt}`}>Ghi chú (tùy chọn)</h3>
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

      {/* Step 4: Choose pet + Confirm */}
      {currentStep === 4 && (
        <div className={styles.stepContent}>
          <div className={styles.stepNav}>
            <button className={styles.backBtn} onClick={() => setCurrentStep(3)}>
              ← Quay lại
            </button>
            <h2 className={styles.stepTitle}>Xác nhận đặt lịch</h2>
          </div>

          {/* Summary */}
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Thông tin đặt lịch</h3>
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
                <span className={styles.summaryValue}>{form.veterinarianName}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>📅 Ngày & Giờ</span>
                <span className={styles.summaryValue}>
                  {new Date(`${form.appointmentDate}T${form.appointmentTime}`).toLocaleString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
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

          {/* Pet selection */}
          <div className={styles.petSection}>
            <h3 className={styles.subSectionTitle}>Chọn thú cưng</h3>
            {loading ? (
              <div className={styles.loadingState}>Đang tải danh sách thú cưng...</div>
            ) : pets.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước khi đặt lịch.</p>
              </div>
            ) : (
              <div className={styles.petList}>
                {pets.map(pet => (
                  <button
                    key={pet.id}
                    className={`${styles.petCard} ${form.petId === pet.id ? styles.selected : ''}`}
                    onClick={() => selectPet(pet)}
                  >
                    <div className={styles.petAvatar}>
                      {pet.imageUrl ? (
                        <img src={pet.imageUrl} alt={pet.name} />
                      ) : (
                        <span>{pet.species?.toLowerCase() === 'cat' ? '🐱' : '🐶'}</span>
                      )}
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
  );
}
