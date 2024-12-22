'use client';

import { Suspense } from "react";
import WatchContent from "./watch-content";
import styles from "./watch.module.css";

export default function Watch() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
      <WatchContent />
    </Suspense>
  );
}