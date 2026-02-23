"use client";

import Link from "next/link";
import { HeaderBar } from "@/components/HeaderBar";
import { FooterNav } from "@/components/FooterNav";

const RESEARCHERS = [
  { name: "Giselle Ann B. Reyes", slug: "reyes" },
  { name: "Jean Krisha A. Dela Peña", slug: "dela-pena" },
  { name: "Micah Veronica R. Duldulao", slug: "duldulao" },
  { name: "Jose Caleb A. Valenzuela", slug: "valenzuela" },
];

export default function ResearchersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-checkered">
      <HeaderBar title="Tracking Records for Alumni Contact & Engagement for School Administration" />

      <main className="flex flex-1 flex-col items-center px-6 py-12">
        <div className="w-full max-w-4xl rounded-2xl border-2 border-[#A03E2D] bg-gradient-to-br from-[#FDF4DD] to-white p-6 shadow-xl shadow-brand-lg sm:p-8 animate-fade-in animate-slide-in-from-bottom">
          <div className="mb-10 rounded-xl border-2 border-[#B23B3B] bg-gradient-to-r from-[#FF7F27] to-[#E85D04] py-4 text-center shadow-md">
            <h2 className="text-xl font-bold text-white text-shadow-lg">About the Researchers</h2>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {RESEARCHERS.map((r, index) => (
              <div
                key={r.slug}
                className="group flex flex-col items-center animate-fade-in animate-slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-xl border-2 border-[#B23B3B] bg-gradient-to-br from-gray-200 to-gray-300 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <div
                    className="h-full w-full bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="mt-3 w-full max-w-[160px] rounded-lg border-2 border-[#FF7F27] bg-gradient-to-br from-[#B23B3B] to-[#8B2E2E] px-3 py-2.5 text-center text-sm font-semibold text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                  {r.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterNav leftLabel="School Registrar" leftHref="/registrar" />
    </div>
  );
}
