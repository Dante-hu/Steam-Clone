'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainNavbar from '../../../components/MainNavbar';
import GameGrid from '../../components/GameGrid';
import { getAllGames } from '../../../lib/gameService';

export default function CategoryPage() {
  const { category } = useParams();
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      if (category) {
        try {
          const allGames = await getAllGames();

          const filtered =
            category.toLowerCase() === 'all'
              ? allGames
              : allGames.filter((game) =>
                  game.categories?.some(
                    (cat) => cat.toLowerCase() === category.toLowerCase()
                  )
                );

          setFilteredGames(filtered);
        } catch (error) {
          console.error('Error fetching games:', error);
        }
      }
    }

    fetchGames();
  }, [category]);

  if (!category) return <div>Loading category...</div>;
  
  if (filteredGames.length === 0) {
    return (
      <div className="bg-[#1b2838] min-h-screen">
        <MainNavbar />
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="text-center text-white font-bold text-4xl md:text-6xl">
            No games found for this category.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1b2838] min-h-screen">
      <MainNavbar />
      <div className="container mx-auto px-4 mt-4">
        <h1 className="text-2xl font-bold text-white mb-4 capitalize">{category} Games</h1>
        <GameGrid games={filteredGames} />
      </div>
    </div>
  );
}






