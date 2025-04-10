'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getGameById } from '../lib/firebase';
import MainNavbar from '../components/MainNavbar';
import Image from 'next/image';

export default function WishlistPage() {
  const { user, removeFromWishlist } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [gameToRemove, setGameToRemove] = useState(null);

  useEffect(() => {
    const fetchWishlistGames = async () => {
      if (!user?.wishlist?.length) {
        setLoading(false);
        return;
      }

      try {
        const gamePromises = user.wishlist.map(gameId => getGameById(gameId));
        const gameResults = await Promise.all(gamePromises);
        setGames(gameResults.filter(game => game !== null));
      } catch (error) {
        console.error('Error fetching wishlist games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistGames();
  }, [user?.wishlist]);

  const handleRemoveClick = (game) => {
    setGameToRemove(game);
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    if (gameToRemove) {
      removeFromWishlist(gameToRemove.id);
      setGames(games.filter(g => g.id !== gameToRemove.id));
    }
    setShowConfirmDialog(false);
    setGameToRemove(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B2838]">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B2838]">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Your Wishlist</h1>
        
        {games.length === 0 ? (
          <div className="text-white text-center py-12">
            Your wishlist is empty. Add some games to see them here!
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((game) => (
              <div key={game.id} className="flex items-center bg-[#2A3F5A] p-4 rounded-lg">
                <div className="flex-shrink-0 w-32 h-32 relative">
                  <Image
                    src={game.boxArt}
                    alt={game.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="ml-6 flex-grow">
                  <h2 className="text-xl font-semibold text-white">{game.name}</h2>
                  <p className="text-gray-300 mt-1">{game.description}</p>
                </div>
                <button
                  onClick={() => handleRemoveClick(game)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#2A3F5A] p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Remove from Wishlist</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to remove {gameToRemove?.name} from your wishlist?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setGameToRemove(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 