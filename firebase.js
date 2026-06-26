import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const cfg={apiKey:window.FIREBASE_API_KEY||'YOUR_FIREBASE_API_KEY',authDomain:window.FIREBASE_AUTH_DOMAIN||'YOUR_PROJECT.firebaseapp.com',projectId:window.FIREBASE_PROJECT_ID||'YOUR_PROJECT_ID',storageBucket:window.FIREBASE_STORAGE_BUCKET||'YOUR_PROJECT.appspot.com',messagingSenderId:window.FIREBASE_MESSAGING_SENDER_ID||'YOUR_SENDER_ID',appId:window.FIREBASE_APP_ID||'YOUR_APP_ID'};
const ok=!cfg.apiKey.startsWith('YOUR_'); const db=ok?getFirestore(initializeApp(cfg)):null;
export async function loadQuizFromFirebase(id){if(!db)throw Error('Firebase not configured');const s=await getDoc(doc(db,'quizzes',id));if(!s.exists())throw Error('Quiz not found');return s.data()}
export async function saveQuizToFirebase(q){if(!db)throw Error('Firebase not configured');await setDoc(doc(db,'quizzes',q.id),{...q,updatedAt:serverTimestamp()});return true}
export async function saveAttemptToFirebase(a){if(!db)return;await addDoc(collection(db,'attempts'),{...a,createdAt:serverTimestamp()})}
