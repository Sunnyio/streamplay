'use client';

import { Fragment } from "react";
import styles from './sign-in.module.css';
import { signInWithGoogle, signOutWithGoogle } from "../firebase/firebase";
import { User } from "firebase/auth";
import Image from "next/image";

interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {
  return (
    <div className={styles.signInContainer}>
      {user ? (
        <div className={styles.userSection}>
          {user.photoURL && (
            <img 
              src={user.photoURL}
              alt="user avatar"
              className={styles.avatar}
            />
          )}
          <button 
            className={styles.signOutButton} 
            onClick={signOutWithGoogle}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button 
          className={styles.signInButton} 
          onClick={signInWithGoogle}
        >
          <Image 
            src="/google-icon.svg" 
            alt="Google" 
            width={20} 
            height={20}
          />
          Sign In
        </button>
      )}
    </div>
  );
}