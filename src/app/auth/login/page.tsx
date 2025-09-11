"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/(components)/ui/card";
import { Button } from "@/(components)/ui/button";
import { Input } from "@/(components)/ui/input";
import { Label } from "@/(components)/ui/label";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/v1/user/signin", formData);
      
      // Check if the response was successful and has the expected structure
      if (response.data?.success && response.data?.data) {
        const token = response.data.data; // JWT token is in the data field
        
        // Decode the JWT to extract user ID (optional, for logging purposes)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id;
          
          // Store the token in localStorage
          localStorage.setItem("jwt_token", token);
          localStorage.setItem("user_id", userId.toString());
          
          console.log("Login successful, token:", token);
          console.log("User ID:", userId);
          
          // Redirect back or to home page
          const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
          router.push(returnUrl || "/");
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          // Still proceed with login if token decoding fails
          localStorage.setItem("jwt_token", token);
          router.push("/");
        }
      } else {
        throw new Error(response.data?.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}