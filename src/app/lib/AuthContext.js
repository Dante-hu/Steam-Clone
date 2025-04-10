'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // Create new user document if it doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            wishlist: [], // Initialize empty wishlist
            createdAt: new Date().toISOString()
          });
        }
        setUser({ ...user, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to add game to wishlist
  const addToWishlist = async (gameId) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        wishlist: [...(user.wishlist || []), gameId]
      });
      setUser(prev => ({
        ...prev,
        wishlist: [...(prev.wishlist || []), gameId]
      }));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // Function to remove game from wishlist
  const removeFromWishlist = async (gameId) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        wishlist: (user.wishlist || []).filter(id => id !== gameId)
      });
      setUser(prev => ({
        ...prev,
        wishlist: (prev.wishlist || []).filter(id => id !== gameId)
      }));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Function to check if game is in wishlist
  const isInWishlist = (gameId) => {
    return user?.wishlist?.includes(gameId) || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 