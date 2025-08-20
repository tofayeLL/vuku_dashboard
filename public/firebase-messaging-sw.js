// Use compat libraries in service workers
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBSlH41q_enL728ru_Q9gk51jiAN4hkOwA",
  authDomain: "hansidar-500b7.firebaseapp.com",
  projectId: "hansidar-500b7",
  storageBucket: "hansidar-500b7.appspot.com", // ✅ FIXED
  messagingSenderId: "323575833471",
  appId: "1:323575833471:web:cbd2095c06bf92267eb04a",
  measurementId: "G-K6639GC77D",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background message received:", payload);
  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message body",
    icon: "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
