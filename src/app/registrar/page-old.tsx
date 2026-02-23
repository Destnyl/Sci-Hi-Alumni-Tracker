"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

type PendingAlumni = {
  id: string;
  name: string;
  strand: string;
  collegeCourse: string;
  currentOccupation: string;
  credentialsInField?: string;
  status: string;
  createdAt?: any;
};

export default function RegistrarPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [pendingAlumni, setPendingAlumni] = useState<PendingAlumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/registrar");
    } else {
      loadPendingRegistrations();
    }
  }, [isAuthenticated, router]);

  async function loadPendingRegistrations() {
    try {
      setLoading(true);
      const response = await fetch("/api/alumni/pending");
      if (response.ok) {
        const data = await response.json();
        setPendingAlumni(data);
      } else {
        setMessage({
          type: "error",
          text: "Failed to load pending registrations",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error loading data" });
    } finally {
      setLoading(false);
    }
  }

  async function handleApproveReject(
    alumniId: string,
    action: "approve" | "reject",
    alumniName: string,
  ) {
    setProcessingId(alumniId);
    setMessage(null);

    try {
      const response = await fetch("/api/alumni/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumniId,
          action,
          reviewedBy: "School Registrar",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: `${alumniName}'s registration has been ${action}d successfully!`,
        });
        // Remove from pending list
        setPendingAlumni((prev) =>
          prev.filter((alumni) => alumni.id !== alumniId),
        );
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || `Failed to ${action} registration`,
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: `Error ${action}ing registration` });
    } finally {
      setProcessingId(null);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-checkered">
        <div className="animate-pulse">
          <p className="text-lg font-semibold text-[#A03E2D]">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-checkered">
      <header
        className="relative overflow-hidden rounded-t-xl bg-gradient-to-b from-[#B23B3B] to-[#8B2E2E] py-8 text-center text-white shadow-lg"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
        <h1 className="relative z-10 text-xl font-bold text-shadow-lg">
          School Registrar Dashboard
        </h1>
        <p className="relative z-10 mt-2 text-sm text-white/90">
          Review and approve alumni registrations
        </p>
      </header>

      <main className="flex flex-1 flex-col px-6 py-8">
        {message && (
          <div
            className={`mb-6 mx-auto max-w-4xl rounded-lg p-4 text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#B23B3B]">
              Pending Alumni Registrations ({pendingAlumni.length})
            </h2>
            <button
              onClick={loadPendingRegistrations}
              disabled={loading}
              className="rounded-lg bg-[#FF7F27] px-4 py-2 text-white font-medium hover:bg-[#E85D04] disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#A03E2D]">Loading pending registrations...</p>
            </div>
          ) : pendingAlumni.length === 0 ? (
            <div className="rounded-2xl border-2 border-[#A03E2D] bg-[#FDF4DD] p-12 text-center">
              <p className="text-lg font-medium text-[#A03E2D]">
                🎉 No pending registrations to review!
              </p>
              <p className="mt-2 text-sm text-[#A03E2D]/80">
                All alumni registrations have been processed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAlumni.map((alumni) => (
                <div
                  key={alumni.id}
                  className="rounded-xl border-2 border-[#A03E2D] bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#B23B3B] mb-2">
                        {alumni.name}
                      </h3>
                      <p className="text-sm text-[#A03E2D]">
                        <strong>Strand:</strong> {alumni.strand}
                      </p>
                      <p className="text-sm text-[#A03E2D]">
                        <strong>Course:</strong> {alumni.collegeCourse}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#A03E2D]">
                        <strong>Occupation:</strong> {alumni.currentOccupation}
                      </p>
                      {alumni.credentialsInField && (
                        <p className="text-sm text-[#A03E2D]">
                          <strong>Credentials:</strong>{" "}
                          {alumni.credentialsInField}
                        </p>
                      )}
                      <p className="text-xs text-[#A03E2D]/70 mt-2">
                        <strong>Submitted:</strong>{" "}
                        {alumni.createdAt
                          ? new Date(
                              alumni.createdAt.seconds * 1000,
                            ).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#A03E2D]/20">
                    <button
                      onClick={() =>
                        handleApproveReject(alumni.id, "approve", alumni.name)
                      }
                      disabled={processingId === alumni.id}
                      className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {processingId === alumni.id
                        ? "Processing..."
                        : "✅ Approve"}
                    </button>
                    <button
                      onClick={() =>
                        handleApproveReject(alumni.id, "reject", alumni.name)
                      }
                      disabled={processingId === alumni.id}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {processingId === alumni.id
                        ? "Processing..."
                        : "❌ Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="flex w-full items-center justify-between bg-gradient-to-r from-[#FF7F27] to-[#E85D04] px-6 py-5 shadow-lg">
        <a
          href="/trace"
          className="group rounded-full border-2 border-[#B23B3B] bg-white/10 px-6 py-2.5 text-[#8B2E2E] underline decoration-2 underline-offset-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-md"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
            ← T.R.A.C.E.
          </span>
        </a>
        <a
          href="/"
          className="group rounded-full border-2 border-[#B23B3B] bg-white/10 px-6 py-2.5 text-[#8B2E2E] underline decoration-2 underline-offset-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-md"
        >
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            Home →
          </span>
        </a>
      </footer>
    </div>
  );
}
