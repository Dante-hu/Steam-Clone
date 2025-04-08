"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllGames } from '../../lib/gameService';
import { getGameImageUrl } from '../../lib/firebase';

const GAMES_PER_PAGE = 10;

export default function GameGrid() {
  const [currentPage, setCurrentPage] = useState(0);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameImages, setGameImages] = useState({});

  useEffect(() => {
    async function fetchGames() {
      const fetchedGames = await getAllGames();
      setGames(fetchedGames);

      // Fetch all game box art images
      const imageUrls = {};
      await Promise.all(
        fetchedGames.map(async (game) => {
          try {
            const imageRef = `StorePageAssets/${game.id}/boxart.jpg`;
            const imageUrl = await getGameImageUrl(game.id, 'boxart');
            if (imageUrl) {
              imageUrls[game.id] = imageUrl;
            }
          } catch (error) {
            console.error(`Error loading image for game ${game.id}:`, error);
          }
        })
      );
      setGameImages(imageUrls);
      setLoading(false);
    }
    fetchGames();
  }, []);

  const totalPages = Math.ceil(games.length / GAMES_PER_PAGE);
  const currentGames = games.slice(
    currentPage * GAMES_PER_PAGE,
    (currentPage + 1) * GAMES_PER_PAGE
  );

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c7e10]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Games Grid */}
      <div className="grid grid-cols-5 gap-4">
        {currentGames.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className="group relative bg-[#171a21] hover:bg-[#1a1a1a] border border-[#2a3f5a] rounded transition-colors"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={gameImages[game.id] || '/placeholder-game1.svg'}
                alt=""
                fill
                className="object-cover rounded-t"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={currentPage === 0}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-center">
                <div className="text-sm text-[#b8b6b4] text-center">
                  <p>{game.categories?.join(', ')}</p>
                  <p>{game.platforms?.join(', ')}</p>
                  <p>
                    <span className="text-[#66c0f4]">👍 {game.positiveReviews}</span>{' '}
                    <span className="text-[#ff4444]">👎 {game.negativeReviews}</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Game Info (Always Visible) */}
            <div className="p-4">
              <div className="flex justify-between items-center text-sm">
                <h3 className="font-medium text-white">{game.title}</h3>
                <span className="font-bold text-white">{game.price === 0 ? 'Free' : `$${game.price}`}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${
            currentPage === 0
              ? 'bg-[#2a3f5a] text-[#b8b6b4] cursor-not-allowed'
              : 'bg-[#5c7e10] hover:bg-[#6c8c1e] text-white'
          }`}
        >
          Previous
        </button>
        <span className="text-[#b8b6b4]">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages - 1
              ? 'bg-[#2a3f5a] text-[#b8b6b4] cursor-not-allowed'
              : 'bg-[#5c7e10] hover:bg-[#6c8c1e] text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 