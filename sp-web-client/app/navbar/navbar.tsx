'use client';

import Image from "next/image";
import styles from './navbar.module.css';
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logoContainer}>
          <Image 
            src="/streamplay-logo.svg" 
            alt="StreamPlay Logo" 
            width={32} 
            height={32} 
            className={styles.logo}
          />
          <span className={styles.brandName}>StreamPlay</span>
        </Link>
      </div>
      <div className={styles.rightSection}>
        {user && <Upload />}
        <SignIn user={user}/>
      </div>
    </nav>
  );
}