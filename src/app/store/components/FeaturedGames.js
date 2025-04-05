"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Using the same games data as GameGrid
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

export default function FeaturedGames() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
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

  return (
    <div className="relative">
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <Image
          src={games[currentSlide].image}
          alt={games[currentSlide].title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Game Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-3xl font-bold mb-2">{games[currentSlide].title}</h3>
          <div className="flex space-x-4 text-sm text-[#b8b6b4] mb-4">
            <span>{games[currentSlide].genre}</span>
            <span>•</span>
            <span>{games[currentSlide].platform}</span>
            <span>•</span>
            <span>{games[currentSlide].rating}/10</span>
          </div>
          <Link 
            href={`/store/game/${games[currentSlide].id}`}
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