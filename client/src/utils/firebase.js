/**
 * Intentional - Firebase Configuration
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAAbse-7Ghcg19eK7b0ModzGbqlvI7rXjo",
  authDomain: "studio-843541099-494c3.firebaseapp.com",
  databaseURL: "https://studio-843541099-494c3-default-rtdb.firebaseio.com",
  projectId: "studio-843541099-494c3",
  storageBucket: "studio-843541099-494c3.firebasestorage.app",
  messagingSenderId: "332982393550",
  appId: "1:332982393550:web:3ba662ae8bdb43602e8e9f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
