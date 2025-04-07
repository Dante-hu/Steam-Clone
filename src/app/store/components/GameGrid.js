"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Import games from catalog.js
const games = [
  {
    id: 1,
    title: "Elden Ring",
    genre: "RPG",
    platform: "PC",
    rating: 9.5,
    image: "/elden-ring.jpg",
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    genre: "RPG",
    platform: "PC",
    rating: 8.0,
    image: "/cyberpunk-2077.jpg",
  },
  {
    id: 3,
    title: "Halo Infinite",
    genre: "Shooter",
    platform: "Xbox",
    rating: 8.5,
    image: "/halo-infinite.jpg",
  },
  {
    id: 4,
    title: "God of War",
    genre: "Action",
    platform: "PlayStation",
    rating: 9.8,
    image: "/god-of-war.jpg",
  },
  {
    id: 5,
    title: "The Witcher 3",
    genre: "RPG",
    platform: "PC",
    rating: 9.7,
    image: "/witcher-3.jpg",
  }
];

const GAMES_PER_PAGE = 10;

export default function GameGrid() {
  const [currentPage, setCurrentPage] = useState(0);
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

  return (
    <div>
      {/* Games Grid */}
      <div className="grid grid-cols-5 gap-4">
        {currentGames.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className="bg-[#171a21] hover:bg-[#1a1a1a] border border-[#2a3f5a] rounded p-4 transition-colors"
          >
            <div className="relative aspect-[16/9] mb-2">
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <h3 className="font-medium mb-1">{game.title}</h3>
            <div className="text-sm text-[#b8b6b4]">
              <div>{game.genre}</div>
              <div>{game.platform}</div>
              <div>Rating: {game.rating}/10</div>
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