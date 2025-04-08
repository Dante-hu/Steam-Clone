"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react"; // Added useEffect import
import { useAuth } from "../lib/AuthContext";
import { auth } from "../lib/firebase";
import {
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import FeaturedGames from "./components/FeaturedGames";
import GameGrid from "./components/GameGrid";
import SearchBar from "./components/SearchBar";
import $ from "jquery";
export default function StorePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); // Track user state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComparison, setRatingComparison] = useState(""); // "gt", "lt", or ""

  // Add auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false); // Close user menu on logout
      setShowProfileMenu(false); // Close profile menu on logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Searching for:", searchQuery);
    }
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };
  // Deselects greater than or less than option.
  useEffect(() => {
    function handleOutsideClick(e) {
      const $modal = $("#rating-modal");
      const $applyButton = $("#apply-rating-btn");

      if (
        $modal.length &&
        !$modal.is(e.target) &&
        $modal.has(e.target).length === 0 &&
        !$applyButton.is(e.target) &&
        $applyButton.has(e.target).length === 0
      ) {
        setRatingComparison(""); // Deselect only if clicked outside
      }
    }

    $(document).on("mousedown", handleOutsideClick);

    return () => {
      $(document).off("mousedown", handleOutsideClick);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.getElementById("profile-menu");
      const profileButton = document.getElementById("profile-button");

      if (
        profileMenu &&
        profileButton &&
        !profileMenu.contains(event.target) &&
        !profileButton.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setEmail("");
      setPassword("");
      setLoginError("");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const categories = [
    "All",
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

  const handleRatingChange = (event) => {
    setRatingValue(parseFloat(event.target.value));
  };

  const handleApplyRating = () => {
    setShowRatingModal(false);
    console.log("Applied Rating:", ratingValue);
    // Add filtering logic here if needed
  };

  const handleCancelRating = () => {
    setShowRatingModal(false);
    setRatingValue(0); // Reset the rating to default
  };

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

          {/* Main Navigation Links */}
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

          {/* User Menu or Login Button */}
          <div className="ml-auto">
            {user ? (
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2"
                >
                  <span className="text-white">
                    {user.displayName || user.email}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#5c7e10] flex items-center justify-center">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-white text-sm">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    )}
                  </div>
                </button>
                {showProfileMenu && (
                  <div
                    id="profile-menu"
                    className="absolute right-0 mt-2 w-48 bg-[#171a21] border border-[#2a3f5a] rounded shadow-lg z-50"
                  >
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-[#b8b6b4] hover:text-white hover:bg-[#2a3f5a] text-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Account Details
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-[#b8b6b4] hover:text-white hover:bg-[#2a3f5a] text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#171a21] border border-[#2a3f5a] rounded shadow-lg z-50">
                    <Link
                      href="/library"
                      className="block px-4 py-2 text-[#b8b6b4] hover:text-white hover:bg-[#2a3f5a]"
                    >
                      Library
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#b8b6b4] hover:text-white hover:bg-[#2a3f5a]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-4 py-2 rounded"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar (Categories, Wishlist, Search) */}
      <nav className="bg-[#171a21] h-12 flex items-center px-4 border-t border-[#2a3f5a]">
        <div className="container mx-auto flex items-center justify-center">
          {/* Categories and Search */}
          <div className="flex items-center space-x-6">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="text-[#b8b6b4] hover:text-white text-sm flex items-center"
              >
                Categories
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-1 bg-[#171a21] border border-[#2a3f5a] rounded shadow-lg z-50 w-48">
                  <div
                    className="block px-4 py-2 text-[#b8b6b4] hover:text-white hover:bg-[#2a3f5a] text-sm cursor-pointer"
                    onClick={() => setShowRatingModal(true)}
                  >
                    <span className="text-sm">Rating</span>{" "}
                    <span style={{ fontSize: "0.5656rem" }}>
                      (Filter Category by Rating)
                    </span>
                  </div>
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
            <div className="flex items-center">
              <SearchBar />
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#316282] text-white px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-[#b8b6b4] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#316282] text-white px-4 py-2 rounded"
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-sm">{loginError}</p>
              )}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleLogin}
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

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171a21] p-6 rounded-lg w-96" id="rating-modal">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Rating</h2>
              <button
                onClick={handleCancelRating}
                className="text-[#b8b6b4] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-[#b8b6b4] mb-1">
                Rating
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={ratingValue}
                onChange={handleRatingChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>0</span>
                <span>10</span>
              </div>
              <div className="text-center text-lg text-[#b8b6b4] mt-2">
                Current Rating: {ratingValue.toFixed(1)}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setRatingComparison("gt")}
                  className={`px-4 py-2 rounded ${
                    ratingComparison === "gt"
                      ? "bg-[#5c7e10] text-white"
                      : "bg-[#2a3f5a] text-[#b8b6b4] hover:text-white"
                  }`}
                >
                  Greater Than
                </button>
                <button
                  onClick={() => setRatingComparison("lt")}
                  className={`px-4 py-2 rounded ${
                    ratingComparison === "lt"
                      ? "bg-[#5c7e10] text-white"
                      : "bg-[#2a3f5a] text-[#b8b6b4] hover:text-white"
                  }`}
                >
                  Less Than
                </button>
                <button
                  onClick={() => setRatingComparison("")}
                  className={`px-4 py-2 rounded ${
                    ratingComparison === ""
                      ? "bg-[#5c7e10] text-white"
                      : "bg-[#2a3f5a] text-[#b8b6b4] hover:text-white"
                  }`}
                >
                  Deselect
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                id="apply-rating-btn"
                onClick={handleApplyRating}
                className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-6 py-2 rounded"
              >
                Apply
              </button>
              <button
                onClick={handleCancelRating}
                className="bg-[#b8b6b4] hover:bg-[#8a8a8a] text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
