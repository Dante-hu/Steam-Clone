'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      router.push(`/search?q=${encodeURIComponent(trimmedSearch)}`);
    } else {
      router.push('/search');
    }
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSearch} className="flex h-8">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search games..."
        className="w-[260px] bg-[#316282] text-white text-sm placeholder-[#b8b6b4] px-3 py-1 rounded-l focus:outline-none"
      />
      <button
        type="submit"
        className="bg-[#5c7e10] hover:bg-[#6c8c1e] px-4 py-1 rounded-r text-sm"
      >
        Search
      </button>
    </form>
  );
} 