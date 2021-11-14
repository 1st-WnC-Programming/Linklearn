// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAKxT4CVX8kt5TGatY457bC__RQNMqn1-I',
  authDomain: 'linklearn2-b0a72.firebaseapp.com',
  projectId: 'linklearn2-b0a72',
  databaseURL: 'https://linklearn2-b0a72-default-rtdb.firebaseio.com',
  storageBucket: 'linklearn2-b0a72.appspot.com',
  messagingSenderId: '313554324787',
  appId: '1:313554324787:web:40e57184d38f9d5544c246',
};
const app = initializeApp(firebaseConfig);

export const rt_db = getDatabase(app);
export const db = getFirestore(app);
export const authService = getAuth();
export const storageService = getStorage();
