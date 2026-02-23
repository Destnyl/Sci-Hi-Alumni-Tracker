"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { BrandBox } from "@/components/BrandBox";
import { useAppStore } from "@/store/useAppStore";

const PLACEHOLDER_PASSWORD = "registrar"; // for demo only

function LoginForm() {
  const router = useRouter();
  const [redirect, setRedirect] = useState("/");
  
  useEffect(() => {
    // Get redirect from URL search params on client side
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect");
      if (redirectParam) {
        setRedirect(redirectParam);
      }
    }
  }, []);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password === PLACEHOLDER_PASSWORD) {
      setAuthenticated(true);
      router.push(redirect);
    } else {
      setError("Invalid password.");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-lg scale-110 transition-transform duration-[20s] ease-in-out"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1200')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-green-800/30 to-green-900/40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 animate-fade-in animate-slide-in-from-top">
          <BrandBox showIcon />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col items-center gap-5 animate-fade-in animate-slide-in-from-bottom"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <label htmlFor="password" className="shrink-0 text-[#A03E2D] font-bold text-lg text-shadow">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full max-w-xs rounded-full border-2 border-[#A03E2D] bg-[#FEEBC8] px-6 py-3 text-[#A03E2D] placeholder-[#A03E2D]/60 shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF7F27]/50 focus:scale-105 hover:border-[#B23B3B] sm:max-w-[280px]"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="animate-fade-in animate-slide-in-from-top text-sm font-medium text-red-600 drop-shadow">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="group rounded-full bg-gradient-to-br from-[#B23B3B] to-[#8B2E2E] px-8 py-3 text-white font-semibold shadow-lg shadow-red-500/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-red-500/50"
          >
            <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">
              Sign in
            </span>
          </button>
        </form>

        <p className="mt-10 max-w-sm text-center text-sm font-medium text-white/95 text-shadow-lg animate-fade-in" style={{ animationDelay: "300ms", animationDuration: "1000ms" }}>
          *ONLY PROVIDED BY <strong className="font-bold">SCHOOL</strong> <strong className="font-bold">REGISTRAR</strong> ONLY
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
