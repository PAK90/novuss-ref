/**
 * Created by Arvids on 2019.08.20..
 */

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "novuss-ref.firebaseapp.com",
  databaseURL: "https://novuss-ref.firebaseio.com",
  projectId: "novuss-ref",
  storageBucket: "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export default firebaseConfig;
