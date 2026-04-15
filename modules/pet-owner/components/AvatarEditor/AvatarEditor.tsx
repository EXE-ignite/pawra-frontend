'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { storageService } from '@/modules/shared/services';
import type { AvatarEditorProps, AvatarTab, PresetAvatar } from './AvatarEditor.types';
import styles from './AvatarEditor.module.scss';

const PRESET_AVATARS: PresetAvatar[] = [
  { label: 'Bé Chó', path: '/avatar/be-cho.png' },
  { label: 'Bé Hamster', path: '/avatar/be-hamster.png' },
  { label: 'Bé Mèo', path: '/avatar/be-meo.png' },
  { label: 'Bé Vẹt', path: '/avatar/be-vet.png' },
];

export function AvatarEditor({ currentAvatarUrl, userInitials, onAvatarChange, isSaving }: AvatarEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AvatarTab>('presets');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleOpen() {
    setIsOpen(true);
    setSelectedPreset(null);
    setUploadedFile(null);
    setUploadPreview(null);
    setUploadProgress(0);
    setError(null);
    setActiveTab('presets');
  }

  function handleClose() {
    if (isUploading) return;
    setIsOpen(false);
  }

  function handlePresetSelect(path: string) {
    setSelectedPreset(path);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 5MB.');
      return;
    }

    setError(null);
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemoveFile() {
    setUploadedFile(null);
    setUploadPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSave() {
    setError(null);

    if (activeTab === 'presets' && selectedPreset) {
      // Delete old avatar from Firebase if it was uploaded there
      storageService.deleteImageByUrl(currentAvatarUrl ?? '');
      onAvatarChange(selectedPreset);
      setIsOpen(false);
      return;
    }

    if (activeTab === 'upload' && uploadedFile) {
      setIsUploading(true);
      try {
        const result = await storageService.uploadImage(
          uploadedFile,
          'avatars',
          ({ progress }) => setUploadProgress(Math.round(progress))
        );
        // Delete old avatar from Firebase after new upload succeeds
        storageService.deleteImageByUrl(currentAvatarUrl ?? '');
        onAvatarChange(result.url);
        setIsOpen(false);
      } catch {
        setError('Tải ảnh lên thất bại. Vui lòng thử lại.');
      } finally {
        setIsUploading(false);
      }
    }
  }

  const canSave =
    (activeTab === 'presets' && !!selectedPreset) ||
    (activeTab === 'upload' && !!uploadedFile);

  return (
    <>
      <div className={styles.avatarWrapper}>
        {currentAvatarUrl ? (
          <Image
            src={currentAvatarUrl}
            alt="Ảnh đại diện"
            width={96}
            height={96}
            className={styles.avatar}
            unoptimized
          />
        ) : (
          <div className={styles.avatarFallback}>
            {userInitials ?? '?'}
          </div>
        )}
        <button
          type="button"
          className={styles.editBtn}
          onClick={handleOpen}
          aria-label="Thay đổi ảnh đại diện"
          disabled={isSaving}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
            <path d="M15.5 2.5a2.121 2.121 0 013 3L12 12l-4 1 1-4 6.5-6.5z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Thay đổi ảnh đại diện</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleClose}
                disabled={isUploading}
                aria-label="Đóng"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${activeTab === 'presets' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('presets')}
              >
                Ảnh mẫu
              </button>
              <button
                type="button"
                className={`${styles.tab} ${activeTab === 'upload' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                Tải ảnh lên
              </button>
            </div>

            <div className={styles.modalBody}>
              {activeTab === 'presets' && (
                <div className={styles.presetGrid}>
                  {PRESET_AVATARS.map(preset => (
                    <button
                      key={preset.path}
                      type="button"
                      className={`${styles.presetItem} ${selectedPreset === preset.path ? styles.presetItemSelected : ''}`}
                      onClick={() => handlePresetSelect(preset.path)}
                    >
                      <Image
                        src={preset.path}
                        alt={preset.label}
                        width={72}
                        height={72}
                        className={styles.presetImg}
                        unoptimized
                      />
                      <span className={styles.presetLabel}>{preset.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'upload' && (
                <>
                  {!uploadPreview ? (
                    <label className={styles.uploadArea}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <span className={styles.uploadIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M4 16l4-4 4 4 4-6 4 6" />
                          <path d="M4 20h16M12 4v8" />
                          <path d="M9 7l3-3 3 3" />
                        </svg>
                      </span>
                      <div className={styles.uploadText}>
                        <span className={styles.uploadPrimary}>Nhấn để chọn ảnh</span>
                        <span className={styles.uploadSecondary}>PNG, JPG, WEBP · Tối đa 5MB</span>
                      </div>
                    </label>
                  ) : (
                    <div className={styles.previewWrapper}>
                      <Image
                        src={uploadPreview}
                        alt="Xem trước"
                        width={120}
                        height={120}
                        className={styles.previewImg}
                        unoptimized
                      />
                      <button
                        type="button"
                        className={styles.changeFileBtn}
                        onClick={handleRemoveFile}
                        disabled={isUploading}
                      >
                        Chọn ảnh khác
                      </button>
                      {isUploading && (
                        <div className={styles.progressWrapper}>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <span className={styles.progressText}>Đang tải lên... {uploadProgress}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {error && <p className={styles.errorMessage}>{error}</p>}
                </>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleClose}
                disabled={isUploading}
              >
                Hủy
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={!canSave || isUploading || isSaving}
              >
                {isUploading ? 'Đang tải lên...' : isSaving ? 'Đang lưu...' : 'Lưu ảnh đại diện'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
