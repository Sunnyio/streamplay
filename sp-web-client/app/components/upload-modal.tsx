'use client';
/* eslint-disable */

import { useState } from 'react';
import styles from './upload-modal.module.css';
import { uploadVideo } from '../firebase/functions';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileInputProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  currentFile: File | null;
}

const FileInput = ({ label, accept, onChange, currentFile }: FileInputProps) => (
  <div className={styles.field}>
    <label>{label}</label>
    <label className={styles.fileInputLabel}>
      <input 
        type="file" 
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        required 
        className={styles.fileInput}
      />
    </label>
  </div>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const validateFileType = (file: File, allowedTypes: string[]) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

const validateFileSize = (file: File, maxSize: number) => {
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
  }
};

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !thumbnail || !title.trim()) return;

    try {
      setIsUploading(true);
      setError(null);

      validateFileType(video, ['video/mp4', 'video/webm', 'video/mov']);
      validateFileType(thumbnail, ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg']);
      validateFileSize(video, MAX_VIDEO_SIZE);
      validateFileSize(thumbnail, MAX_THUMBNAIL_SIZE);

      await uploadVideo({
        video,
        thumbnail,
        title: title.trim(),
        description: description.trim()
      });

      onClose();
    } catch (error) {
      console.error(error);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Upload Video</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <FileInput 
            label="Video File"
            accept="video/*"
            onChange={setVideo}
            currentFile={video}
          />

          <FileInput 
            label="Thumbnail"
            accept="image/*"
            onChange={setThumbnail}
            currentFile={thumbnail}
          />

          <div className={styles.field}>
            <label>Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter video title"
              className={styles.textInput}
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={4}
              className={styles.textInput}
            />
          </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isUploading}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUploading || !video || !thumbnail || !title.trim()}
              className={styles.submitButton}
            >
              {isUploading ? (
                <>
                  <LoadingSpinner />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}