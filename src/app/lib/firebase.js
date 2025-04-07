// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

export async function getGameImageUrl(gameId, imageType = 'boxart') {
  try {
    const imageRef = ref(storage, `StorePageAssets/${gameId}/${imageType}.jpg`);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error(`Error getting game ${imageType}:`, error);
    return null;
  }
}

export async function getGameGalleryUrls(gameId) {
  try {
    const storage = getStorage();
    const urls = [];
    // Try to get images numbered 1 through 4 (you can adjust this number)
    for (let i = 1; i <= 4; i++) {
      try {
        const imageRef = ref(storage, `StorePageAssets/${gameId}/${i}.jpg`);
        const url = await getDownloadURL(imageRef);
        urls.push(url);
      } catch (error) {
        // Stop trying if we hit a missing number
        break;
      }
    }
    return urls;
  } catch (error) {
    console.error('Error getting game gallery:', error);
    return [];
  }
}
