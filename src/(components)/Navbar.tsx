// app/(components)/Navbar.tsx
"use client"; // only for auth state toggle

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for JWT token from localStorage
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        // Decode JWT to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsLoggedIn(true);
        setUserEmail(payload.email || null);
      } catch (error) {
        console.error("Error decoding token:", error);
        // If token is invalid, remove it
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_id");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogin = () => {
    // Navigate to login page with current page as return URL
    const currentUrl = window.location.pathname + window.location.search;
    router.push(`/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    setUserEmail(null);
    
    // Redirect to home page
    router.push("/");
  };

  return (
    <nav className="w-full bg-[#05203c] shadow-md px-6 py-9 flex justify-between items-center">
      {/* Left side: Logo */}
      <div className="font-bold pl-10 text-xl text-white font-sans">
        {/* It's good practice to make the logo a link to the homepage */}
        <Link href="/">Lumen Airlines</Link> 
      </div>

      {/* Right side: Links and Buttons */}
      <div className="flex items-center gap-6">
        <Link href="/help" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">
          Help
        </Link>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Show user email if available */}
              {userEmail && (
                <span className="text-sm text-blue-200">
                  Welcome, {userEmail}
                </span>
              )}
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}