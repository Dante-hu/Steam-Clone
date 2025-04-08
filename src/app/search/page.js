'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllGames } from '../lib/gameService';
import { getGameImageUrl } from '../lib/firebase';
import MainNavbar from '../components/MainNavbar';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [gameImages, setGameImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  // Fetch all games and extract unique categories
  useEffect(() => {
    async function fetchGames() {
      try {
        const allGames = await getAllGames();
        setGames(allGames);

        // Extract unique categories
        const categories = new Set();
        allGames.forEach(game => {
          game.categories?.forEach(category => categories.add(category));
        });
        setAllCategories(Array.from(categories).sort());

        // Fetch game images
        const imageUrls = {};
        await Promise.all(
          allGames.map(async (game) => {
            try {
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
      } catch (error) {
        console.error('Error fetching games:', error);
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  // Filter games based on search term and selected categories
  useEffect(() => {
    const filtered = games.filter(game => {
      const matchesSearch = searchTerm === '' || 
        game.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategories = selectedCategories.length === 0 || 
        selectedCategories.every(category => game.categories?.includes(category));

      return matchesSearch && matchesCategories;
    });

    setFilteredGames(filtered);
  }, [searchTerm, selectedCategories, games]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set('q', searchTerm);
    router.push(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div>
        <MainNavbar showStoreNav={false} />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c7e10]"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MainNavbar showStoreNav={false} />
      <div className="min-h-screen bg-[#1b2838] text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games..."
                className="flex-grow bg-[#316282] text-white placeholder-[#b8b6b4] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5c7e10]"
              />
              <button
                type="submit"
                className="bg-[#5c7e10] hover:bg-[#6c8c1e] px-6 py-2 rounded"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex gap-8">
            {/* Categories */}
            <div className="w-[250px] flex-shrink-0">
              <div className="bg-[#171a21] p-4 rounded">
                <button 
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center justify-between w-full text-xl font-bold mb-4"
                >
                  <span>Categories</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${showCategories ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCategories && (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {allCategories.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="form-checkbox h-4 w-4 text-[#5c7e10] rounded border-[#b8b6b4] bg-transparent"
                        />
                        <span className="text-[#b8b6b4] hover:text-white">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map(game => (
                  <Link key={game.id} href={`/game/${game.id}`}>
                    <div className="bg-[#171a21] rounded overflow-hidden hover:transform hover:scale-105 transition-transform duration-200">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={gameImages[game.id] || '/placeholder-game1.svg'}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-[#b8b6b4]">
                            {game.price === 0 ? 'Free' : `$${game.price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-12 text-[#b8b6b4]">
                  No games found matching your criteria
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #171a21;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #316282;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #407494;
        }
      `}</style>
    </div>
  );
} 