"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Add this import

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username"); // You'll need to add this field to your form

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      // Create user with email and password in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Optional: Update the user's display name with the username
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // Redirect to /store on success
      router.push("/store");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#171a21] flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="space-y-4 bg-[#171a21] p-6 rounded-lg w-96"
      >
        <div>
          <label className="block text-sm text-[#b8b6b4] mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full bg-[#316282] text-white px-4 py-2 rounded"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-[#b8b6b4] mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full bg-[#316282] text-white px-4 py-2 rounded"
            placeholder="Enter password"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-[#5c7e10] hover:bg-[#6c8c1e] text-white px-6 py-2 rounded"
          >
            Register
          </button>
          <Link
            href="/store"
            className="text-[#b8b6b4] hover:text-white text-sm"
          >
            Already have an account
          </Link>
        </div>
      </form>
    </div>
  );
}
