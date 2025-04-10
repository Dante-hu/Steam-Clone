"use client";

import Link from "next/link";
import MainNavbar from "../../components/MainNavbar";

export default function Support() {
  //Topics array
  const helpTopics = [
    { title: "Account Issues", url: "#account" },
    { title: "Billing and Payments", url: "#billing" },
    { title: "Technical Support", url: "#technical" },
    { title: "Game Returns", url: "#returns" },
    { title: "Community Guidelines", url: "#community" },
  ];

  return (
    <div className="min-h-screen bg-[#1b2838] text-white flex flex-col">
      {/* Main Navbar Componenet*/}
      <MainNavbar />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Support</h1>
        <p className="text-lg mb-8 text-[#b8b6b4] text-center">
          Need help with Steam Clone? Search our knowledge base or browse common
          topics below.
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full bg-[#316282] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5c7e10]"
          />
        </div>

        {/* Help Topics */}
        <div className="space-y-4">
          {helpTopics.map((topic, index) => (
            <div
              key={index}
              className="bg-[#171a21] p-4 rounded-lg shadow-lg border border-[#2a3f5a] hover:bg-[#2a3f5a] transition duration-200"
            >
              <Link
                href={topic.url}
                className="text-[#b8b6b4] hover:text-white text-lg"
              >
                {topic.title}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#b8b6b4]">
            Can’t find what you need? Contact us at{" "}
            <Link
              href="mailto:support@steamclone.com"
              className="text-[#5c7e10] hover:underline"
            >
              support@steamclone.com
            </Link>{" "}
            or visit our{" "}
            <Link
              href="/store/about"
              className="text-[#5c7e10] hover:underline"
            >
              About
            </Link>{" "}
            page for more information.
          </p>
        </div>
      </div>
    </div>
  );
}