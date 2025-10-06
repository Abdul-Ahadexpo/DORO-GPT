import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC7crQ2H-I8a6LHShsQj7jOBfnDTJbGllk",
  authDomain: "delivery-status-55d14.firebaseapp.com",
  databaseURL: "https://delivery-status-55d14-default-rtdb.firebaseio.com",
  projectId: "delivery-status-55d14",
  storageBucket: "delivery-status-55d14.firebasestorage.app",
  messagingSenderId: "822945322583",
  appId: "1:822945322583:web:0945a72379ebc4164b7512"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
