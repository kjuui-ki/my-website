/* ========================================
   Rawad Health - Firebase Configuration
   Uses Firebase Compat SDK (loaded via CDN in HTML)
   ======================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAuPfU8pl4Zd9WDbGpsk5Vi_IQMm0oln-E",
  authDomain: "rawad-health2.firebaseapp.com",
  projectId: "rawad-health2",
  storageBucket: "rawad-health2.firebasestorage.app",
  messagingSenderId: "1088532835326",
  appId: "1:1088532835326:web:8cfc6c13fb28ed9beaeeaf",
  measurementId: "G-VTVQC2GD6C"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('[Firebase] ✅ Initialized — project:', firebaseConfig.projectId);
} else {
  console.log('[Firebase] ⚠️ Already initialized — project:', firebase.app().options.projectId);
}
