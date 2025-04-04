'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

export default function ImagePage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        // Initialize Firebase with config from environment variables
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        
        // Reference to the image in the root of storage
        const imageRef = ref(storage, 'yuuka.jpg');
        
        // Get the download URL
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (err) {
        console.error('Error fetching image URL:', err);
        setError('Failed to load image');
      } finally {
        setLoading(false);
      }
    }

    fetchImageUrl();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Image Display</h1>
      
      {loading && <p>Loading image...</p>}
      
      {error && <p className="text-red-500">{error}</p>}
      
      {imageUrl && (
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt="Yuuka"
            width={800}
            height={600}
            className="object-contain"
            priority
          />
          <p className="p-4 text-center">yuuka.jpg</p>
        </div>
      )}
    </div>
  );
}