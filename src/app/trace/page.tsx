"use client";

import Link from "next/link";
import { HeaderBar } from "@/components/HeaderBar";
import { FooterNav } from "@/components/FooterNav";

export default function TracePage() {
  return (
    <div className="flex min-h-screen flex-col bg-checkered">
      <HeaderBar title="Tracking Records for Alumni Contact & Engagement for School Administration" />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-2xl border-2 border-[#B23B3B] bg-white/95 backdrop-blur-sm p-8 shadow-xl shadow-brand-lg animate-fade-in animate-slide-in-from-bottom">
          <Link
            href="/trace"
            className="group mb-8 block w-full rounded-xl bg-gradient-to-r from-[#FF7F27] via-[#FF6B1A] to-[#E85D04] py-5 text-center text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/40"
          >
            <span className="inline-block text-shadow-lg transition-transform duration-300 group-hover:scale-105">
              Alumni List & Contact Information
            </span>
          </Link>

          <div className="mb-6">
            <Link
              href="/alumni-registration"
              className="group block w-full rounded-xl bg-gradient-to-r from-[#B23B3B] via-[#A03E2D] to-[#8B2D1F] py-4 text-center text-base font-semibold text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/40"
            >
              <span className="inline-block text-shadow-lg transition-transform duration-300 group-hover:scale-105">
                🎓 Are you an alumni? Register Here!
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8">
            <Link
              href="/trace/abm"
              className="group flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF7F27] via-[#FF6B1A] to-[#B23B3B] py-12 text-2xl font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-orange-500/40 sm:max-w-[220px]"
            >
              <span className="underline decoration-2 underline-offset-4 text-shadow-lg transition-transform duration-300 group-hover:scale-110">
                ABM
              </span>
            </Link>
            <Link
              href="/trace/stem"
              className="group flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF7F27] via-[#FF6B1A] to-[#B23B3B] py-12 text-2xl font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-orange-500/40 sm:max-w-[220px]"
            >
              <span className="underline decoration-2 underline-offset-4 text-shadow-lg transition-transform duration-300 group-hover:scale-110">
                STEM
              </span>
            </Link>
          </div>
        </div>
      </main>

      <FooterNav
        leftLabel="Our Team - The Researchers"
        leftHref="/researchers"
      />
    </div>
  );
}
