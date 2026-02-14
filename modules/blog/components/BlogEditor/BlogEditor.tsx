'use client';

import { useState, useEffect } from 'react';
import { BlogEditorProps, Category } from './BlogEditor.types';
import { RichTextEditor } from '../RichTextEditor';
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
  const [categories] = useState<Category[]>([
    { id: 'health', name: 'Health', slug: 'health' },
    { id: 'nutrition', name: 'Nutrition', slug: 'nutrition' },
    { id: 'training', name: 'Training', slug: 'training' },
    { id: 'behavior', name: 'Behavior', slug: 'behavior' },
    { id: 'grooming', name: 'Grooming', slug: 'grooming' },
  ]);

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
    // Note: categoryId and excerpt are optional since BE doesn't support them yet

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
              placeholder="Short description (optional - not saved yet)"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              rows={3}
              disabled
            />
            <span className={styles.hint}>Backend doesn't support excerpt yet</span>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Settings</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Category <span className={styles.hint}>(optional - not saved yet)</span>
              </label>
              <select
                className={`${styles.select} ${errors.categoryId ? styles.error : ''}`}
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                disabled
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className={styles.hint}>Backend doesn't support categories yet</span>
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
              <label className={styles.label}>Image URL</label>
              <input
                type="text"
                className={styles.input}
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnailUrl}
                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              />
              {formData.thumbnailUrl && (
                <div className={styles.imagePreview}>
                  <img src={formData.thumbnailUrl} alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
