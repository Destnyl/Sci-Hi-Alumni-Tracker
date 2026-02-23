"use client";

import Link from "next/link";

export function BrandBox({ showIcon = false }: { showIcon?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        className="group rounded-xl bg-gradient-to-br from-[#FF7F27] to-[#E85D04] px-6 py-4 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40"
      >
        <div className="text-xl font-bold leading-tight text-shadow">Bernoulli</div>
        <div className="text-sm font-medium opacity-95">25&apos;-26&apos;</div>
        <div className="text-xs font-normal opacity-90">Alumni Tracking Website</div>
      </Link>
      {showIcon && (
        <div className="relative">
          <div
            className="h-16 w-14 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-lg shadow-yellow-500/40 transition-all duration-300 hover:scale-110 hover:rotate-3"
            style={{
              clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
            aria-hidden
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}
