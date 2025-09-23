// app/(components)/Navbar.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, userId, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    const currentUrl = window.location.pathname + window.location.search;
    router.push(`/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="w-full bg-[#05203c] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-xl font-bold text-white font-sans">
            <Link href="/">Lumen Airlines</Link>
          </div>

          {/* Links & buttons */}
          <div className="flex items-center space-x-6">
            <Link
              href="/help"
              className="text-sm font-medium text-white hover:text-blue-200 transition-colors"
            >
              Help
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2 text-blue-200">
                  <User size={20} />
                  <span className="text-sm">Hi, {userId}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
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
      </div>
    </nav>
  );
}
