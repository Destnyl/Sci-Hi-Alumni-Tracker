"use client";

import Link from "next/link";

type NavButtonProps = {
  href: string;
  label: string;
  active?: boolean;
  className?: string;
};

export function NavButton({ href, label, active = false, className = "" }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`group block w-full max-w-xs rounded-xl border-2 px-6 py-3.5 text-center font-semibold underline decoration-2 underline-offset-2 transition-all duration-300 sm:max-w-sm ${className} ${
        active
          ? "border-[#B23B3B] bg-gradient-to-br from-[#B23B3B] to-[#8B2E2E] text-white shadow-md shadow-red-500/30 hover:scale-105 hover:shadow-lg hover:shadow-red-500/40"
          : "border-[#A03E2D] bg-[#FDF4DD] text-[#A03E2D] shadow-sm hover:scale-105 hover:bg-white hover:shadow-md"
      }`}
    >
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        {label}
      </span>
    </Link>
  );
}
