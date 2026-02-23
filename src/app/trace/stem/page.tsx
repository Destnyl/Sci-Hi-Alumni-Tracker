"use client";

import { useEffect, useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { FooterNav } from "@/components/FooterNav";

type Alumni = {
  id?: string;
  name: string;
  strand: string;
  collegeCourse: string;
  currentOccupation: string;
  credentialsInField?: string;
  createdAt?: any;
  updatedAt?: any;
};

export default function StemPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  async function loadAlumni(query: string) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ strand: "STEM" });
      if (query.trim()) {
        params.set("q", query.trim());
      }
      const res = await fetch(`/api/alumni?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch alumni data");
      }
      const data: Alumni[] = await res.json();
      setAlumni(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not load STEM alumni list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlumni("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-checkered">
      <HeaderBar title="Tracking Records for Alumni Contact & Engagement for School Administration" />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl rounded-2xl border-2 border-[#B23B3B] bg-white/95 backdrop-blur-sm p-8 shadow-xl shadow-brand-lg animate-fade-in">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#B23B3B] text-shadow">
            STEM — Alumni List & Contact Information
          </h2>

          <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-[#A03E2D]">
              Search alumni by name, course, or occupation.
            </p>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (typingTimeout) clearTimeout(typingTimeout);
                const timeout = setTimeout(() => {
                  loadAlumni(value);
                }, 400);
                setTypingTimeout(timeout);
              }}
              placeholder="Search alumni..."
              className="w-full max-w-xs rounded-full border-2 border-[#A03E2D] bg-[#FDF4DD] px-4 py-2 text-sm text-[#A03E2D] placeholder-[#A03E2D]/70 focus:outline-none focus:ring-2 focus:ring-[#FF7F27]"
            />
          </div>

          {loading && (
            <p className="text-center text-[#A03E2D]">Loading STEM alumni...</p>
          )}

          {error && <p className="text-center text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#FEEBC8] text-sm">
                <thead>
                  <tr className="bg-[#FDF4DD]">
                    <th className="px-3 py-2 text-left font-semibold text-[#A03E2D]">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-[#A03E2D]">
                      Strand
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-[#A03E2D]">
                      College Course
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-[#A03E2D]">
                      Current Occupation
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-[#A03E2D]">
                      Credentials in Their Field
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FEEBC8]/60">
                  {alumni.map((a, idx) => (
                    <tr key={a.id || idx} className="hover:bg-[#FDF4DD]/60">
                      <td className="px-3 py-2 text-[#8B2E2E] font-medium">
                        {a.name}
                      </td>
                      <td className="px-3 py-2 text-[#A03E2D]">{a.strand}</td>
                      <td className="px-3 py-2 text-[#A03E2D]">
                        {a.collegeCourse}
                      </td>
                      <td className="px-3 py-2 text-[#A03E2D]">
                        {a.currentOccupation}
                      </td>
                      <td className="px-3 py-2 text-[#A03E2D]">
                        {a.credentialsInField}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <FooterNav
        leftLabel="Our Team - The Researchers"
        leftHref="/researchers"
      />
    </div>
  );
}
