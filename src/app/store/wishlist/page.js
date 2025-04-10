'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { getGameById } from '../../lib/gameService';
import { getGameImageUrl } from '../../lib/firebase';
import MainNavbar from '../../components/MainNavbar';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const { user, removeFromWishlist } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [gameToRemove, setGameToRemove] = useState(null);
  const [gameImages, setGameImages] = useState({});

  useEffect(() => {
    const fetchWishlistGames = async () => {
      if (!user?.wishlist?.length) {
        setLoading(false);
        return;
      }

      try {
        const gamePromises = user.wishlist.map(gameId => getGameById(gameId));
        const gameResults = await Promise.all(gamePromises);
        const validGames = gameResults.filter(game => game !== null);
        setGames(validGames);

        // Fetch images for all games
        const imagePromises = validGames.map(async (game) => {
          const imageUrl = await getGameImageUrl(game.id);
          return { id: game.id, url: imageUrl };
        });
        const images = await Promise.all(imagePromises);
        const imageMap = images.reduce((acc, { id, url }) => {
          acc[id] = url;
          return acc;
        }, {});
        setGameImages(imageMap);
      } catch (error) {
        console.error('Error fetching wishlist games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistGames();
  }, [user?.wishlist]);

  const handleRemoveClick = (e, game) => {
    e.stopPropagation(); // Prevent navigation when clicking remove
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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
              <Link 
                href={`/game/${game.id}`}
                key={game.id}
                className="block"
              >
                <div className="flex items-center bg-[#2A3F5A] p-4 rounded-lg hover:bg-[#3A4F6A] transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-32 h-32 relative">
                    <Image
                      src={gameImages[game.id] || '/placeholder.jpg'}
                      alt={game.title || 'Game cover image'}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-6 flex-grow">
                    <h2 className="text-xl font-semibold text-white">{game.title}</h2>
                    <p className="text-gray-300 mt-1">
                      {truncateText(game.categories?.join(', ') || 'No categories specified', 50)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleRemoveClick(e, game)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#2A3F5A] p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Remove from Wishlist</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to remove {gameToRemove?.title} from your wishlist?
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