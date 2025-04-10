"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';

export default function MainNavbar() {
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.getElementById('profile-menu');
      const profileButton = document.getElementById('profile-button');

      if (
        profileMenu &&
        profileButton &&
        !profileMenu.contains(event.target) &&
        !profileButton.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setEmail('');
      setPassword('');
      setLoginError('');
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <>
      <nav className="bg-[#171a21] h-20 flex items-center px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/store">
              <Image
                src="/placeholder-logo.svg"
                alt="Steam Clone Logo"
                width={40}
                height={40}
                className="cursor-pointer"
              />
            </Link>

            {/* Main Navigation Links */}
            <Link
              href="/store"
              className="text-[#b8b6b4] hover:text-white font-medium"
            >
              STORE
            </Link>
            <Link
              href="/store/about"
              className="text-[#b8b6b4] hover:text-white font-medium"
            >
              ABOUT
            </Link>
            <Link
              href="/store/support"
              className="text-[#b8b6b4] hover:text-white font-medium"
            >
              SUPPORT
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
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
                      href="/store/account"
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

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171a21] p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Login</h2>
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
    </>
  );
}
