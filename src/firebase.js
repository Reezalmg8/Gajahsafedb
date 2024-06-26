// src/firebase.js
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyCIJpO2PY3ll-fQ0vsf1NA4FIHfxpd_qq0",
  authDomain: "gajahsafe-expo.firebaseapp.com",
  projectId: "gajahsafe-expo",
  storageBucket: "gajahsafe-expo.appspot.com",
  messagingSenderId: "627291161287",
  appId: "1:627291161287:web:b537055c023cd8c311f4e2"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
