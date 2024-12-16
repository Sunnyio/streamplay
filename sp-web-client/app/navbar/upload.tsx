'use client';
import { Fragment, useState } from 'react';
import { uploadVideo } from '../firebase/functions';
import styles from './upload.module.css';

export default function Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      await uploadVideo(file);
      setAlertType('success');
      setAlertMessage('Video uploaded successfully! It will be processed shortly.');
      setShowAlert(true);
    } catch (error) {
      setAlertType('error');
      setAlertMessage(`Error uploading video: ${error}`);
      setShowAlert(true);
      console.error(error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
    }
  }

  return (
    <Fragment>
      <input 
        id="upload" 
        className={styles.uploadInput} 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label 
        htmlFor="upload" 
        className={`${styles.uploadButton} ${isUploading ? styles.uploading : ''}`}
      > 
        {isUploading ? (
          <>
            <div className={styles.spinner} />
            Uploading...
          </>
        ) : (
          <>
            Upload
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </>
        )}
      </label>

      {showAlert && (
        <div className={`${styles.alert} ${styles[alertType]}`}>
          <div className={styles.alertContent}>
            {alertType === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
            )}
            <span>{alertMessage}</span>
          </div>
          <div className={styles.alertProgress} />
        </div>
      )}
    </Fragment>
  )
}