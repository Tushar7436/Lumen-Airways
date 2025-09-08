// app/(components)/Navbar.tsx
"use client"; // only for auth state toggle

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Example: check auth token from localStorage or API
    const token = localStorage.getItem("auth_token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <nav className="w-full bg-[#05203c] shadow-md px-6 py-9 flex justify-between items-center">
      {/* Left side: Logo */}
      <div className="font-bold pl-10 text-xl text-white font-sans">
        {/* It's good practice to make the logo a link to the homepage */}
        <Link href="/">Lumen Airlines</Link> 
      </div>

      {/* Right side: Links and Buttons */}
      <div className="flex items-center gap-6">
        <Link href="/help" className="text-sm font-medium text-white">Help</Link>
        <div>
          {isLoggedIn ? (
            <button className="bg-red-500 text-white px-4 py-2 rounded-md text-white">
              Logout
            </button>
          ) : (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}