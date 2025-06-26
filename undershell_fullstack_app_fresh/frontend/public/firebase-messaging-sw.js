importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCg7EgoEBwLzFQJCLIrnT3luXQsIArAfUk",
  authDomain: "womens-safty-a5078.firebaseapp.com",
  projectId: "womens-safty-a5078",
  storageBucket: "womens-safty-a5078.firebasestorage.app",
  messagingSenderId: "738427323933",
  appId: "1:738427323933:web:5a7888e3c5e29edba728f4",
  measurementId: "G-84KPKX4LHY"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png'
  });
});