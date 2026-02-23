"use client";

type HeaderBarProps = {
  title: string;
  className?: string;
};

export function HeaderBar({ title, className = "" }: HeaderBarProps) {
  return (
    <header
      className={`relative overflow-hidden rounded-t-xl bg-gradient-to-b from-[#B23B3B] to-[#8B2E2E] py-8 text-center text-white shadow-lg ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      <h1 className="relative z-10 px-4 text-lg font-bold leading-snug text-shadow-lg sm:text-xl md:text-2xl">
        {title}
      </h1>
    </header>
  );
}
