'use client';

import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export async function getAllGames() {
  try {
    const gamesCollection = collection(db, 'game_info');
    const snapshot = await getDocs(gamesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

export async function getGameById(gameId) {
  try {
    const gameDoc = doc(db, 'game_info', gameId);
    const gameSnapshot = await getDoc(gameDoc);
    if (gameSnapshot.exists()) {
      return {
        id: gameSnapshot.id,
        ...gameSnapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
} 