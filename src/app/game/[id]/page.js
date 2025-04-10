'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getGameById } from '../../lib/gameService';
import { getGameImageUrl, getGameGalleryUrls } from '../../lib/firebase';
import { increment, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function GamePage({ params }) {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boxArtImage, setBoxArtImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const gameId = use(params).id;
  const [positiveReviews, setPositiveReviews] = useState(game?.positiveReviews || 0);
  const [negativeReviews, setNegativeReviews] = useState(game?.negativeReviews || 0);

  useEffect(() => {
    async function fetchGameData() {
      try {
        const gameData = await getGameById(gameId);
        console.log('Game Data:', gameData);
        setGame(gameData);

        // Fetch box art image
        const boxArtUrl = await getGameImageUrl(gameId, 'boxart');
        if (boxArtUrl) {
          setBoxArtImage(boxArtUrl);
        }

        // Fetch numbered screenshots
        const screenshotUrls = await getGameGalleryUrls(gameId);
        setScreenshots(screenshotUrls);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching game data:', error);
        setLoading(false);
      }
    }
    fetchGameData();
  }, [gameId]);


  const handleReview = async (type) => {
    const gameRef = doc(db, "game_info", gameId);

    try {
      await updateDoc(gameRef, {
        [type === "positive" ? "positiveReviews" : "negativeReviews"] : increment(1)
      });

      if (type === "positive"){
        setPositiveReviews((prev) => prev + 1);
      }
      else{
        setNegativeReviews((prev) => prev + 1);
      }
    }
    catch (error) {
      console.error("Error updating review:", error);
    }

  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c7e10]"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#1b2838] text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl mb-4">Game not found</h1>
          <button
            onClick={() => router.back()}
            className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-4 py-2 rounded"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b2838] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#b8b6b4] hover:text-white mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Store
        </button>

        <div className="flex gap-8">
          {/* Left Column - Game Image and Purchase */}
          <div className="w-[300px] flex-shrink-0">
            <div className="bg-[#171a21] p-2 rounded">
              <div className="relative aspect-[3/4] rounded overflow-hidden">
                <Image
                  src={boxArtImage || '/placeholder-game1.svg'}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold mb-3">
                  {game.price === 0 ? 'Free' : `$${game.price}`}
                </div>
                <button className="w-full bg-[#5c7e10] hover:bg-[#6c8c1e] text-white py-2 rounded mb-2">
                  Add to Cart
                </button>
                <button className="w-full bg-[#2a3f5a] hover:bg-[#3a4f6a] text-white py-2 rounded">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Game Info */}
          <div className="flex-grow">
            {/* Title and Basic Info */}
            <div className="bg-[#171a21] p-6 rounded mb-6">
              <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
              <div className="grid grid-cols-2 gap-4 text-sm text-[#b8b6b4] mt-4">
                <div>
                  <p><span className="font-medium">Categories:</span> {game.categories?.join(', ')}</p>
                  <p><span className="font-medium">Platform:</span> {game.platforms?.join(', ')}</p>
                </div>
                <div>
                  <p><span className="font-medium">Release Date:</span> {game.release_date}</p>
                  <p>
                    <span className="font-medium">Reviews:</span>{' '}
                    <span className="text-[#66c0f4]">👍 {game.positiveReviews + positiveReviews}</span>{' '}
                    <span className="text-[#ff4444]">👎 {game.negativeReviews + negativeReviews}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#171a21] p-6 rounded mb-6">
              <h2 className="text-xl font-bold mb-4">About This Game</h2>
              <div className={`relative ${!isDescriptionExpanded ? 'max-h-[120px]' : 'max-h-full'} overflow-hidden transition-all duration-300`}>
                <div 
                  className="text-[#b8b6b4] game-description"
                  dangerouslySetInnerHTML={{ __html: game.description }}
                />
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#171a21] to-transparent" />
                )}
              </div>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="flex items-center justify-center w-full mt-2 text-[#b8b6b4] hover:text-white"
              >
                <span className="mr-2">{isDescriptionExpanded ? 'Show Less' : 'Read More'}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div className="bg-[#171a21] p-6 rounded mb-6">
                <h2 className="text-xl font-bold mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 gap-4">
                  {screenshots.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded overflow-hidden">
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Requirements */}
            {(game.specs?.minimum || game.specs?.recommended) && (
              <div className="bg-[#171a21] p-6 mb-6 rounded">
                <h2 className="text-xl font-bold mb-4">System Requirements</h2>
                <div className="grid grid-cols-2 gap-8">
                  {game.specs?.minimum && (
                    <div>
                      <h3 className="font-semibold mb-2">Minimum</h3>
                      <div className="space-y-2 text-[#b8b6b4]">
                        {Object.entries(game.specs.minimum).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</span> {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {game.specs?.recommended && (
                    <div>
                      <h3 className="font-semibold mb-2">Recommended</h3>
                      <div className="space-y-2 text-[#b8b6b4]">
                        {Object.entries(game.specs.recommended).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</span> {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/*review good or bad*/}
            <div className="bg-[#171a21] p-6 rounded mb-6 text-white max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">Review the game</h2>
              <div className="flex gap-6">
                <button 
                  className="bg-[#3b3f46] hover:bg-[#4b4f57] text-yellow-300 text-2xl p-4 rounded-lg shadow-md transition-all duration-200"
                  onClick={() => handleReview("positive")}
                  >👍</button>
                <button 
                  className="bg-[#3b3f46] hover:bg-[#4b4f57] text-yellow-300 text-2xl p-4 rounded-lg shadow-md transition-all duration-200"
                  onClick={() => handleReview("negative")}
                  >👎</button>
              </div>
              
            </div>

            {/* rating dynamic graph*/}
            <div className="bg-[#171a21] p-6 rounded mb-6 text-white max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">Reviews Comparison</h2>

              {/* Compute total reviews and ratios */}
              {(() => {
                const total = positiveReviews + game.positiveReviews + negativeReviews + game.negativeReviews;
                const pos = game.positiveReviews + positiveReviews;
                const neg = game.negativeReviews + negativeReviews;

                const maxHeight = 200; // max bar height
                const posRatio = pos / (pos + neg || 1); 
                const negRatio = neg / (pos + neg || 1);

                const posHeight = posRatio * maxHeight;
                const negHeight = negRatio * maxHeight;

                return (
                  <div className="flex gap-12 items-end h-48 justify-center">
                    {/* Positive Reviews */}
                  <div className="flex flex-col items-center">
<<<<<<< HEAD
                    <span className="mb-2 text-lg font-semibold">{game.positiveReviews + positiveReviews }</span>
                    <div
                      className="bg-blue-500 w-12 rounded"
                      style={{ height: `${game.positiveReviews + positiveReviews}px` }}
                    />
=======
                    <span className="mb-0 text-lg font-semibold">{pos}</span>
                    <div className="h-40 w-12 bg-gray-800 rounded relative overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-300"
                        style={{ height: `${posHeight}px` }} 
                      />
                    </div>
>>>>>>> d09d553cbb3b59a5c02207f649e5dc42ab368f26
                    <span className="mt-2 text-sm">Positive</span>
                  </div>

                  {/* Negative Reviews */}
                  <div className="flex flex-col items-center">
<<<<<<< HEAD
                    <span className="mb-2 text-lg font-semibold">{game.negativeReviews + negativeReviews}</span>
                    <div
                      className="bg-red-500 w-12 rounded"
                      style={{ height: `${(game.negativeReviews + negativeReviews ) }px` }} 
                    />
=======
                    <span className="mb-0 text-lg font-semibold">{neg}</span>
                    <div className="h-40 w-12 bg-gray-800 rounded relative overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 w-full bg-red-500 transition-all duration-300"
                        style={{ height: `${negHeight}px` }} 
                      />
                    </div>
>>>>>>> d09d553cbb3b59a5c02207f649e5dc42ab368f26
                    <span className="mt-2 text-sm">Negative</span>
                  </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Add styles for the HTML content */}
      <style jsx global>{`
        .game-description h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: white;
        }
        .game-description h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: white;
        }
        .game-description p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .game-description ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .game-description li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
} 