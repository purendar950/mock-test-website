// Firebase adapter. Fill .env values in a real build system or replace below manually for static hosting.
// Firestore collections used:
// quizzes/{quizId} -> quiz document
// attempts/{attemptId} -> submitted attempt document

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: window.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: window.FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: window.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: window.FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: window.FIREBASE_APP_ID || 'YOUR_APP_ID'
};

function ready(){ return firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_'); }
const app = ready() ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

export async function loadQuizFromFirebase(quizId){
  if(!db) throw new Error('Firebase is not configured. Add your Firebase config first.');
  const snap = await getDoc(doc(db, 'quizzes', quizId));
  if(!snap.exists()) throw new Error(`Quiz not found in Firebase: ${quizId}`);
  return snap.data();
}

export async function saveQuizToFirebase(quiz){
  if(!db) throw new Error('Firebase is not configured. Add your Firebase config first.');
  await setDoc(doc(db, 'quizzes', quiz.id), {...quiz, updatedAt: serverTimestamp()});
  return {ok:true, id: quiz.id};
}

export async function saveAttemptToFirebase(attempt){
  if(!db) return {ok:false, skipped:true, reason:'Firebase not configured'};
  const ref = await addDoc(collection(db, 'attempts'), {...attempt, createdAt: serverTimestamp()});
  return {ok:true, id: ref.id};
}
