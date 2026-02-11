/**
 * Firebase Storage Service
 * Handles image uploads for blog content
 */

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase.config';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
}

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

class StorageService {
  /**
   * Upload image to Firebase Storage
   * @param file - Image file to upload
   * @param folder - Storage folder (default: 'blog-images')
   * @param onProgress - Optional progress callback
   * @returns Promise with public URL
   */
  async uploadImage(
    file: File,
    folder: string = 'blog-images',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 9);
      const extension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${extension}`;
      const storagePath = `${folder}/${fileName}`;

      console.log('[Firebase Storage] Uploading:', storagePath);

      // Create storage reference
      const storageRef = ref(storage, storagePath);

      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<UploadResult>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress({
                bytesTransferred: snapshot.bytesTransferred,
                totalBytes: snapshot.totalBytes,
                progress,
              });
            }
            console.log(`[Firebase Storage] Upload progress: ${progress.toFixed(1)}%`);
          },
          (error) => {
            // Handle upload error
            console.error('[Firebase Storage] Upload failed:', error);
            reject(error);
          },
          async () => {
            // Upload completed successfully, get download URL
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('[Firebase Storage] Upload complete:', downloadURL);

              resolve({
                url: downloadURL,
                path: storagePath,
                fileName,
              });
            } catch (error) {
              console.error('[Firebase Storage] Failed to get download URL:', error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('[Firebase Storage] Upload failed:', error);
      throw error;
    }
  }

  /**
   * Delete image from Firebase Storage
   * @param path - Storage path to delete
   */
  async deleteImage(path: string): Promise<void> {
    try {
      console.log('[Firebase Storage] Deleting:', path);
      
      // Create storage reference
      const storageRef = ref(storage, path);
      
      // Delete the file
      await deleteObject(storageRef);
      
      console.log('[Firebase Storage] Delete complete');
    } catch (error) {
      console.error('[Firebase Storage] Delete failed:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
