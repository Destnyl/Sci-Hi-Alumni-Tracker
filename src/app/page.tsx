"use client";

import Link from "next/link";
import { BrandBox } from "@/components/BrandBox";
import { NavButton } from "@/components/NavButton";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with background */}
      <header className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-800 shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 transition-transform duration-[30s] ease-in-out"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1200')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent" />
        <div className="relative z-10 flex min-h-[220px] items-center px-6 py-10">
          <div className="animate-fade-in">
            <BrandBox />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border-2 border-[#A03E2D] bg-gradient-to-br from-[#FDF4DD] to-white p-8 shadow-xl shadow-brand-lg animate-fade-in">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#A03E2D] text-shadow">
            Home
          </h2>
          <div className="flex flex-col items-center gap-5">
            <NavButton href="/trace" label="T.R.A.C.E." active />
            <NavButton
              href="/alumni-registration"
              label="Alumni Registration"
            />
            <NavButton href="/registrar" label="School Registrar" />
            <NavButton
              href="/alumni-discovery"
              label="Find Alumni for Research"
            />
            <NavButton href="/researchers" label="Our Team - The Researchers" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center gap-3 border-t-2 border-gray-200 bg-white py-5 shadow-inner">
        <a
          href="https://facebook.com/HCPSMScienceHS"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-[#B23B3B] transition-all duration-300 hover:bg-[#B23B3B] hover:text-white hover:scale-110"
          aria-label="Facebook"
        >
          <svg
            className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <span className="text-sm font-semibold text-gray-700">
          HCPSMScienceHS
        </span>
      </footer>
    </div>
  );
}
