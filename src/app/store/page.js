"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import FeaturedGames from "./components/FeaturedGames";
import GameGrid from "./components/GameGrid";

export default function StorePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // Here you would typically handle the search
      console.log("Searching for:", searchQuery);
    }
  };

  const categories = [
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Simulation",
    "Sports",
    "Racing",
    "Indie",
    "Casual",
    "Multiplayer",
  ];

  return (
    <div className="min-h-screen bg-[#1b2838] text-white flex flex-col">
      {/* Main Navigation Bar */}
      <nav className="bg-[#171a21] h-20 flex items-center px-4">
        <div className="container mx-auto flex items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/placeholder-logo.svg"
              alt="Steam Clone Logo"
              width={40}
              height={40}
              className="mr-4"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 ml-20">
            <Link
              href="/store"
              className="text-[#b8b6b4] hover:text-white font-medium"
            >
              STORE
            </Link>
            <Link
              href="/about"
              className="text-[#b8b6b4] hover:text-white font-medium"
            >
              ABOUT
            </Link>
            <Link
              href="/support"
              className="text-[#b8b6b4] hover:text-white font-medium"
            >
              SUPPORT
            </Link>
          </div>

          {/* Login Button */}
          <div className="ml-auto">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-4 py-2 rounded"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Store Navigation Bar */}
      <nav className="bg-[#171a21] h-12 flex items-center px-4 border-t border-[#2a3f5a] mt-2.5">
        <div className="container mx-auto flex items-center justify-center">
          {/* Categories and Search */}
          <div className="flex items-center space-x-4">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="text-[#b8b6b4] hover:text-white text-sm flex items-center"
              >
                Categories
                <span className="ml-1">▼</span>
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-1 bg-[#171a21] border border-[#2a3f5a] rounded shadow-lg z-50 w-48">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/store/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-[#b8b6b4] hover:text-white hover:bg-[#2a3f5a] text-sm"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/store/wishlist"
              className="text-[#b8b6b4] hover:text-white text-sm"
            >
              Wishlist
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs mx-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-[#316282] text-white px-4 py-2 rounded placeholder-[#b8b6b4] text-sm"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Featured Games Section */}
        <div className="container mx-auto px-4 mt-8">
          <h2 className="text-2xl font-bold mb-4">Featured Games</h2>
          <FeaturedGames />
        </div>

        {/* Game Grid Section */}
        <div className="container mx-auto px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">All Games</h2>
          <GameGrid />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#171a21] py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-[#b8b6b4] text-sm">
          <p>
            © 2025 Placeholder Corporation. All rights reserved. All trademarks
            are property of their respective owners in Canada and other
            countries.
          </p>
          <p>VAT included in all prices where applicable.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171a21] p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Login</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-[#b8b6b4] hover:text-white"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-[#b8b6b4] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full bg-[#316282] text-white px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-[#b8b6b4] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-[#316282] text-white px-4 py-2 rounded"
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-6 py-2 rounded"
                >
                  Login
                </button>
                <Link
                  href="/store/register"
                  className="text-[#b8b6b4] hover:text-white text-sm"
                >
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
