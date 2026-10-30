// Shared Firebase setup (Firestore + Auth). SDK version is pinned.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, limit, serverTimestamp, Timestamp, getCountFromServer, writeBatch } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';

const cfg = (window.TGU_CONFIG || {}).firebase || {};
export const ready = !!(cfg.apiKey && cfg.projectId);
export const app = ready ? initializeApp(cfg) : null;
export const db = ready ? getFirestore(app) : null;
export const auth = ready ? getAuth(app) : null;
export { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, limit, serverTimestamp, Timestamp, getCountFromServer, writeBatch, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged };
