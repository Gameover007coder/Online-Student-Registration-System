// ------------------------------------------------------------------
// PASTE YOUR OWN FIREBASE PROJECT CONFIG HERE.
// You get this from: Firebase Console → Project settings → General
// → "Your apps" → Web app (</>) → SDK setup and configuration.
// See README.md for the full step-by-step.
// ------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
