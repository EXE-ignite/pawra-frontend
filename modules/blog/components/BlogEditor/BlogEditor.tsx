'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogEditorProps, Category } from './BlogEditor.types';
import { RichTextEditor } from '../RichTextEditor';
import { blogCategoryService } from '@/modules/blog/services';
import { storageService } from '@/modules/shared/services/firebase/storage.service';
import styles from './BlogEditor.module.scss';

export function BlogEditor({ mode, initialData, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    categoryId: initialData?.categoryId || '',
    status: initialData?.status || 'Draft' as const,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories from API
  useEffect(() => {
    blogCategoryService.getBlogCategories()
      .then((data: any[]) => {
        const mapped: Category[] = data.map((cat: any) => ({
          id: cat.id || cat.slug || cat,
          name: cat.name || cat,
          slug: cat.slug || cat,
        }));
        setCategories(mapped);
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && formData.title && !initialData?.slug) {
      const autoSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, mode, initialData?.slug]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'Draft' | 'Published') => {
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ ...formData, status }, status);
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const result = await storageService.uploadImage(file, 'blog-thumbnails', ({ progress }) => {
        setUploadProgress(Math.round(progress));
      });
      handleChange('thumbnailUrl', result.url);
    } catch (error: any) {
      alert(`Upload failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className={styles.draftButton}
            onClick={() => handleSubmit('Draft')}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            className={styles.publishButton}
            onClick={() => handleSubmit('Published')}
            disabled={isSaving}
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              placeholder="Enter blog post title..."
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Content <span className={styles.required}>*</span>
            </label>
            
            <RichTextEditor
              content={formData.content}
              onChange={(html) => handleChange('content', html)}
              placeholder="Start writing your blog post... Use the toolbar to format text, add images, and more."
              hasError={!!errors.content}
              minHeight={500}
            />
            {errors.content && <span className={styles.errorText}>{errors.content}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Excerpt</label>
            <textarea
              className={styles.textarea}
              placeholder="Short description of the post..."
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Settings</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Category <span className={styles.required}>*</span>
              </label>
              <select
                className={`${styles.select} ${errors.categoryId ? styles.error : ''}`}
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                disabled={categoriesLoading}
              >
                <option value="">{categoriesLoading ? 'Loading...' : 'Select a category'}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className={styles.errorText}>{errors.categoryId}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as 'Draft' | 'Published')}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Featured Image</h3>

            <div className={styles.formGroup}>
              {formData.thumbnailUrl ? (
                <div className={styles.imagePreview}>
                  <img src={formData.thumbnailUrl} alt="Preview" />
                  <button
                    type="button"
                    className={styles.removeImage}
                    onClick={() => handleChange('thumbnailUrl', '')}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaDragging : ''} ${isUploading ? styles.uploadAreaUploading : ''}`}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className={styles.uploadProgressWrapper}>
                      <div className={styles.uploadProgressText}>Uploading... {uploadProgress}%</div>
                      <div className={styles.uploadProgressBar}>
                        <div className={styles.uploadProgressFill} style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <p className={styles.uploadAreaText}>Drag & drop or <span>click to upload</span></p>
                      <p className={styles.uploadAreaHint}>PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleFileInputChange}
              />

              <div className={styles.uploadOr}>
                <span>or enter URL</span>
              </div>

              <input
                type="text"
                className={styles.input}
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnailUrl}
                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
