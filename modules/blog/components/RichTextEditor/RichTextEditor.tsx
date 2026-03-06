'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useState, useCallback, useRef } from 'react';
import { RichTextEditorProps } from './RichTextEditor.types';
import { storageService } from '@/modules/shared/services/firebase/storage.service';
import styles from './RichTextEditor.module.scss';

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Start writing your blog post...',
  hasError = false,
  disabled = false,
  minHeight = 400,
}: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // Only H2 and H3
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false, // Fix SSR hydration mismatch
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Upload to Firebase Storage
      const result = await storageService.uploadImage(
        file,
        'blog-images',
        (progress) => {
          setUploadProgress(progress.progress);
        }
      );

      // Insert image into editor
      editor.chain().focus().setImage({ src: result.url }).run();

      console.log('[RichTextEditor] Image uploaded:', result.url);
    } catch (error) {
      console.error('[RichTextEditor] Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [editor]);

  // Trigger file input
  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      // Reset input
      e.target.value = '';
    }
  }, [handleImageUpload]);

  if (!editor) {
    return <div className={styles.loading}>Loading editor...</div>;
  }

  return (
    <div className={`${styles.richTextEditor} ${hasError ? styles.error : ''}`}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Text formatting */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.active : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled}
            title="Bold (Ctrl+B)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.active : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled}
            title="Italic (Ctrl+I)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.active : ''}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={disabled}
            title="Underline (Ctrl+U)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className={styles.toolbarDivider}></div>

        {/* Headings */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={disabled}
            title="Heading 2"
          >
            <strong>H2</strong>
          </button>

          <button
            type="button"
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={disabled}
            title="Heading 3"
          >
            <strong>H3</strong>
          </button>
        </div>

        <div className={styles.toolbarDivider}></div>

        {/* Lists */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.active : ''}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled}
            title="Bullet List"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.active : ''}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled}
            title="Numbered List"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className={styles.toolbarDivider}></div>

        {/* Image upload */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={`${styles.toolbarButton} ${styles.imageButton}`}
            onClick={triggerImageUpload}
            disabled={disabled || isUploading}
            title="Insert Image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
            </svg>
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Insert Image'}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Editor content */}
      <div 
        className={styles.editorContent}
        style={{ minHeight: `${minHeight}px` }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Upload progress */}
      {isUploading && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className={styles.progressText}>Uploading image... {uploadProgress}%</span>
        </div>
      )}
    </div>
  );
}
