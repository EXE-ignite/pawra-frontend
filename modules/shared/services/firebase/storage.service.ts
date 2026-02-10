/**
 * Firebase Storage Service
 * Handles image uploads for blog content
 */

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

      // TODO: Replace with actual Firebase Storage implementation
      // For now, simulate upload with mock delay
      console.log('[Firebase Storage] Uploading:', storagePath);

      // Simulate upload progress
      if (onProgress) {
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          onProgress({
            bytesTransferred: (file.size * i) / 100,
            totalBytes: file.size,
            progress: i,
          });
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Return mock URL (replace with actual Firebase public URL)
      const mockUrl = URL.createObjectURL(file);
      
      console.log('[Firebase Storage] Upload complete:', mockUrl);

      return {
        url: mockUrl,
        path: storagePath,
        fileName,
      };
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
      // TODO: Implement actual Firebase Storage deletion
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('[Firebase Storage] Delete complete');
    } catch (error) {
      console.error('[Firebase Storage] Delete failed:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
