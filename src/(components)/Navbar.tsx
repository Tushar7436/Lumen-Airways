// app/(components)/Navbar.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, userId, userName, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    const currentUrl = window.location.pathname + window.location.search;
    router.push(`/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`);
  };

const handleLogout = () => {
  logout(); // this should clear state and localStorage inside AuthContext
  router.push("/");
};

  return (
    <nav className="w-full bg-[#05203c] shadow-md px-6 py-9 flex justify-between items-center">
      {/* Left side: Logo */}
      <div className="font-bold pl-10 text-xl text-white font-sans">
        <Link href="/">Lumen Airlines</Link>
      </div>

      {/* Right side: Links and Buttons */}
      <div className="flex items-center gap-6">
        <Link
          href="/help"
          className="text-sm font-medium text-white hover:text-blue-200 transition-colors"
        >
          Help
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Profile icon + userId */}
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
