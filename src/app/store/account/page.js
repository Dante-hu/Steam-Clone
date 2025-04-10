"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { auth } from "../../lib/firebase";
import { signOut, updateProfile } from "firebase/auth";
import Image from "next/image";
import MainNavbar from "../../components/MainNavbar";

export default function Account() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [gamesOwned, setGamesOwned] = useState(0); // Mock data
  const [playtime, setPlaytime] = useState(0); // Mock data in hours
  const [level, setLevel] = useState(1); // Mock level

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.email.split("@")[0] || "User");
      setNewDisplayName(user.displayName || "");
      // Mock data for now can replace with actual data if needed
      setGamesOwned(Math.floor(Math.random() * 100) + 50); // Random between 50-150
      setPlaytime(Math.floor(Math.random() * 1000)); // Random playtime up to 1000 hours
      setLevel(Math.floor(Math.random() * 20) + 1); // Random level 1-20
    }
  }, [user]);

  const handleUpdateDisplayName = async (e) => {
    e.preventDefault();
    if (!newDisplayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      setSuccess("Display name updated successfully!");
      setError("");
      setDisplayName(newDisplayName);
    } catch (err) {
      setError("Failed to update display name. Please try again.");
      setSuccess("");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/store";
    } catch (err) {
      setError("Failed to log out. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1b2838] flex items-center justify-center text-white">
        <p>Please log in to view your account.</p>
        <Link href="/store" className="text-[#5c7e10] ml-2">
          Go to Store
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center p-6 relative"
      style={{
        background: "#000", // Black background
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(92, 126, 16, 0.1) 0%, transparent 70%),
          radial-gradient(circle at 80% 80%, rgba(49, 98, 130, 0.1) 0%, transparent 70%)
        `, // Circular gradient pattern
      }}
    >
      {/* Main Navbar */}
      <MainNavbar />
      {/*Overlay for subtle texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-0"></div>

      <div className="w-full max-w-4xl z-10 mt-4">
        {" "}
        {/* Added margin-top for spacing */}
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-[#5c7e10] rounded-full flex items-center justify-center mr-6 border-4 border-[#2a3f5a]">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full"
              />
            ) : (
              <span className="text-white text-3xl">
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{displayName}</h1>
            <p className="text-[#b8b6b4] text-lg">Level {level}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Stats Card */}
          <div className="bg-[#171a21] p-6 rounded-lg shadow-lg border border-[#2a3f5a]">
            <h2 className="text-2xl font-semibold mb-4">Profile Stats</h2>
            <p>
              Games Owned: <span className="text-[#5c7e10]">{gamesOwned}</span>
            </p>
            <p>
              Playtime: <span className="text-[#5c7e10]">{playtime} hours</span>
            </p>
            <p>
              Recent Activity:{" "}
              <span className="text-[#5c7e10]">
                Played 17.9 hours past 2 weeks
              </span>
            </p>
          </div>

          {/* Account Details Card */}
          <div className="bg-[#171a21] p-6 rounded-lg shadow-lg border border-[#2a3f5a]">
            <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}
            <p>
              Email: <span className="text-[#b8b6b4]">{user.email}</span>
            </p>
            <form onSubmit={handleUpdateDisplayName} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-[#b8b6b4] mb-1">
                  New Display Name
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full bg-[#316282] text-white px-4 py-2 rounded"
                  placeholder="Enter new display name"
                />
              </div>
              <button
                type="submit"
                className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-4 py-2 rounded"
              >
                Update Display Name
              </button>
            </form>
            <button
              onClick={handleLogout}
              className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-4 py-2 rounded mt-4 w-full"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Library Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Library</h3>
            <Link
              href="/store/library"
              className="text-[#b8b6b4] hover:text-white"
            >
              View Library
            </Link>
          </div>
          {/* Badges Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Badges</h3>
            <p className="text-[#b8b6b4]">16 Badges</p>
          </div>
          {/* Screenshots Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Screenshots</h3>
            <p className="text-[#b8b6b4]">456 Screenshots</p>
          </div>
          {/* Videos Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Videos</h3>
            <p className="text-[#b8b6b4]">10 Videos</p>
          </div>
          {/* Workshop Items Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Workshop Items</h3>
            <p className="text-[#b8b6b4]">20 Items</p>
          </div>
          {/* Reviews Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Reviews</h3>
            <p className="text-[#b8b6b4]">5 Reviews</p>
          </div>
          {/* Groups Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Groups</h3>
            <p className="text-[#b8b6b4]">10 Groups</p>
          </div>
          {/* Friends Card */}
          <div className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200">
            <h3 className="font-semibold mb-2">Friends</h3>
            <p className="text-[#b8b6b4]">204 Friends</p>
          </div>
        </div>
      </div>
    </div>
  );
}
