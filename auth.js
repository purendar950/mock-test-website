import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const cfg={apiKey:window.FIREBASE_API_KEY||'YOUR_FIREBASE_API_KEY',authDomain:window.FIREBASE_AUTH_DOMAIN||'YOUR_PROJECT.firebaseapp.com',projectId:window.FIREBASE_PROJECT_ID||'YOUR_PROJECT_ID',storageBucket:window.FIREBASE_STORAGE_BUCKET||'YOUR_PROJECT.appspot.com',messagingSenderId:window.FIREBASE_MESSAGING_SENDER_ID||'YOUR_SENDER_ID',appId:window.FIREBASE_APP_ID||'YOUR_APP_ID'};
const configured=!cfg.apiKey.startsWith('YOUR_');
const app=configured?(getApps()[0]||initializeApp(cfg)):null;
export const auth=app?getAuth(app):null; export const db=app?getFirestore(app):null;
export function requireFirebase(){ if(!auth||!db) throw Error('Firebase is not configured. Add your config first.'); }
export function watchUser(cb){ if(!auth) return cb(null,null); return onAuthStateChanged(auth, async user=>{ let profile=null; if(user&&db){ const ref=doc(db,'users',user.uid); const snap=await getDoc(ref); if(!snap.exists()) await setDoc(ref,{name:user.displayName||'',email:user.email,isPremium:false,role:'student',createdAt:serverTimestamp()}); profile=(await getDoc(ref)).data(); } cb(user,profile); }); }
export async function googleLogin(){requireFirebase(); return signInWithPopup(auth,new GoogleAuthProvider())}
export async function emailLogin(email,password,mode='login'){requireFirebase(); return mode==='signup'?createUserWithEmailAndPassword(auth,email,password):signInWithEmailAndPassword(auth,email,password)}
export async function logout(){requireFirebase(); return signOut(auth)}
export function isPremium(profile){return !!(profile&&profile.isPremium)}
