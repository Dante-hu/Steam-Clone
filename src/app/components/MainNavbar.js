"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../lib/AuthContext";

export default function MainNavbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-[#171a21] text-white relative z-50">
      <div className="container mx-auto px-4">
        <div className="h-12 flex items-center justify-between">
          {/* Left Side - Logo and Nav Links */}
          <div className="flex items-center space-x-8">
            <Link href="/store" className="flex items-center">
              <div className="bg-[#87CF3C] w-8 h-8 flex items-center justify-center rounded font-bold">
                SC
              </div>
            </Link>
            <div className="flex items-center space-x-8 text-sm">
              <Link href="/store" className="text-[#b8b6b4] hover:text-white">
                STORE
              </Link>
              <Link href="/about" className="text-[#b8b6b4] hover:text-white">
                ABOUT
              </Link>
              <Link href="/support" className="text-[#b8b6b4] hover:text-white">
                SUPPORT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
