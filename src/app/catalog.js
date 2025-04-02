"use client";

import { useState } from "react";
import Image from "next/image";

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
  },
];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [rating, setRating] = useState("");

  const filteredGames = games.filter(
    (game) =>
      game.title.toLowerCase().includes(search.toLowerCase()) &&
      (genre === "" || game.genre === genre) &&
      (platform === "" || game.platform === platform) &&
      (rating === "" || game.rating >= parseFloat(rating))
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Game Catalog</h1>

      {/* Filtering Section */}
      <div className="mb-4 p-4 border rounded bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <select onChange={(e) => setGenre(e.target.value)} className="border p-2 mr-2 w-full mb-2">
          <option value="">All Genres</option>
          <option value="RPG">RPG</option>
          <option value="Shooter">Shooter</option>
          <option value="Action">Action</option>
        </select>
        <select onChange={(e) => setPlatform(e.target.value)} className="border p-2 w-full mb-2">
          <option value="">All Platforms</option>
          <option value="PC">PC</option>
          <option value="Xbox">Xbox</option>
          <option value="PlayStation">PlayStation</option>
        </select>
        <input
          type="number"
          placeholder="Minimum Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      {/* Games List */}
      <ul className="mt-4 space-y-4">
        {filteredGames.map((game) => (
          <li key={game.id} className="border-b p-2 flex items-center space-x-4">
            <Image
              src={game.image}
              alt={game.title}
              width={80}
              height={80}
              className="rounded-md"
            />
            <div>
              <strong>{game.title}</strong> - {game.genre} ({game.platform}) - Rating: {game.rating}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


