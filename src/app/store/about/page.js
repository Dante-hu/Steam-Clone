"use client";

import Link from "next/link";
import MainNavbar from "../../components/MainNavbar";

export default function About() {
  return (
    <div className="min-h-screen bg-[#1b2838] text-white flex flex-col">
      {/* Main Navbar component*/}
      <MainNavbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          About Steam Clone
        </h1>
        <p className="text-lg mb-8 text-[#b8b6b4] text-center">
          Welcome to Steam Clone, a digital distribution platform designed to
          bring players together worldwide. Inspired by the original Steam
          platform, this web-app was designed with the intention to replicate
          some core components of the Steam app
        </p>
        {/* Card-Like Layout component*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#171a21] p-6 rounded-lg shadow-lg border border-[#2a3f5a]">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-[#b8b6b4]">
              Our mission is to create a vibrant gaming ecosystem where players
              can discover, play, and connect with friends. We aim to support
              developers by providing a platform to distribute their creations
              globally.
            </p>
          </div>
          <div className="bg-[#171a21] p-6 rounded-lg shadow-lg border border-[#2a3f5a]">
            <h2 className="text-2xl font-semibold mb-4">Platform Highlights</h2>
            <ul className="list-disc list-inside text-[#b8b6b4]">
              <li>Access to a store to view games</li>
              <li>Search feature</li>
              <li>Account Log in, and user name customization</li>
            </ul>
          </div>
        </div>

        {/*Styling*/}
        <div className="bg-[#171a21] p-6 rounded-lg shadow-lg border border-[#2a3f5a] text-center">
          <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
          <p className="text-[#b8b6b4]">
            This is not a real company and have no intentions of ACTUALLY
            copying Steam. Please contact support if you have any inquiries,
            <Link
              href="/store/support"
              className="text-[#5c7e10] hover:underline"
            >
              {" "}
              Support
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}