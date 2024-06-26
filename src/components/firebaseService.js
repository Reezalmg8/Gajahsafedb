import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIJpO2PY3ll-fQ0vsf1NA4FIHfxpd_qq0",
  authDomain: "gajahsafe-expo.firebaseapp.com",
  projectId: "gajahsafe-expo",
  storageBucket: "gajahsafe-expo.appspot.com",
  messagingSenderId: "627291161287",
  appId: "1:627291161287:web:b537055c023cd8c311f4e2"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export const fetchReports = async () => {
  const querySnapshot = await getDocs(collection(db, 'reports'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    animalSpotted: doc.data().animalSpotted || '',
    image: doc.data().image || '',
    latitude: doc.data().location ? doc.data().location.latitude || 0 : 0,
    longitude: doc.data().location ? doc.data().location.longitude || 0 : 0,
    phoneNumber: doc.data().phoneNumber || '',
    timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
    userId: doc.data().userId || '',
    userName: doc.data().userName || '',
  }));
};
