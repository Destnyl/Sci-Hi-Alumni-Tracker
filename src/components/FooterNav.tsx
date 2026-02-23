"use client";

import Link from "next/link";

type FooterNavProps = {
  leftLabel: string;
  leftHref: string;
  rightLabel?: string;
  rightHref?: string;
};

export function FooterNav({ leftLabel, leftHref, rightLabel = "Home", rightHref = "/" }: FooterNavProps) {
  return (
    <footer className="mt-auto flex w-full items-center justify-between bg-gradient-to-r from-[#FF7F27] to-[#E85D04] px-6 py-5 shadow-lg sm:px-8">
      <Link
        href={leftHref}
        className="group rounded-full border-2 border-[#B23B3B] bg-white/10 px-6 py-2.5 text-[#8B2E2E] underline decoration-2 underline-offset-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-md"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
          {leftLabel}
        </span>
      </Link>
      <Link
        href={rightHref}
        className="group rounded-full bg-gradient-to-br from-[#B23B3B] to-[#8B2E2E] px-6 py-2.5 text-white underline decoration-2 underline-offset-2 shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/40"
      >
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          {rightLabel}
        </span>
      </Link>
    </footer>
  );
}
