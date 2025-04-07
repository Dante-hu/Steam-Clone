'use client';

import { useEffect, useState, use } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../lib/firebase';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';

export default function ImagePage({ params }) {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { game_id } = use(params);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Reference to the specific game document
        const gameRef = doc(db, 'game_info', game_id);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
          const data = gameSnap.data();
          console.log('Game document data:', data); // debug
          setGameData(data);
        } else {
          console.log('No such game document!');
          setGameData(null);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
        setGameData(null);
      } finally {
        setLoading(false);
      }
    };

    if (game_id) {
      fetchGameData();
    }
  }, [game_id]);

  return (
    <div>
      {loading ? (
        <p>Loading game data...</p>
      ) : gameData ? (
        <div>
          <h1>Game Info</h1>
          <pre>{JSON.stringify(gameData, null, 2)}</pre>
        </div>
      ) : (
        <p>No game data found for ID: {game_id}</p>
      )}
    </div>
  );
}