"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllGames } from '../../lib/gameService';
import { getGameImageUrl } from '../../lib/firebase';

export default function FeaturedGames() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [games, setGames] = useState([]);
  const [gameImages, setGameImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      const fetchedGames = await getAllGames();
      const featuredGames = fetchedGames.slice(0, 5);
      setGames(featuredGames);

      // Fetch header images for featured games
      const imageUrls = {};
      await Promise.all(
        featuredGames.map(async (game) => {
          const imageUrl = await getGameImageUrl(game.id, 'header');
          if (imageUrl) {
            imageUrls[game.id] = imageUrl;
          }
        })
      );
      setGameImages(imageUrls);
      setLoading(false);
    }
    fetchGames();
  }, []);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    let interval;
    if (isAutoPlaying && games.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % games.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, games.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % games.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + games.length) % games.length);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c7e10]"></div>
      </div>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <Image
          src={gameImages[games[currentSlide].id] || '/placeholder-game1.svg'}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Game Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-3xl font-bold mb-2">{games[currentSlide].title}</h3>
          <div className="flex space-x-4 text-sm text-[#b8b6b4] mb-4">
            <span>{games[currentSlide].categories?.join(', ')}</span>
            <span>•</span>
            <span>{games[currentSlide].platforms?.join(', ')}</span>
            <span>•</span>
            <span>
              <span className="text-[#66c0f4]">👍 {games[currentSlide].positiveReviews}</span>{' '}
              <span className="text-[#ff4444]">👎 {games[currentSlide].negativeReviews}</span>
            </span>
            <span>•</span>
            <span>{games[currentSlide].price === 0 ? 'Free' : `$${games[currentSlide].price}`}</span>
          </div>
          <Link 
            href={`/game/${games[currentSlide].id}`}
            className="inline-block bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-6 py-2 rounded"
          >
            View Details
          </Link>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          ❯
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-[#b8b6b4]' : 'bg-[#2a3f5a]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 