// Import the functions you need from the SDKs you need
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, Messaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSlH41q_enL728ru_Q9gk51jiAN4hkOwA",
  authDomain: "hansidar-500b7.firebaseapp.com",
  projectId: "hansidar-500b7",
  storageBucket: "hansidar-500b7.appspot.com",
  messagingSenderId: "323575833471",
  appId: "1:323575833471:web:cbd2095c06bf92267eb04a",
  measurementId: "G-K6639GC77D",
};

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics (only works in browser, not server)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

// Messaging (for push notifications)
let messaging: Messaging | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, analytics, messaging };
