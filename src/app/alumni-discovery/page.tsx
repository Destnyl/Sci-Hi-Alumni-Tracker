"use client";

import { useEffect, useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { FooterNav } from "@/components/FooterNav";

type Alumni = {
  id: string;
  name: string;
  strand: string;
  shsSection?: string;
  collegeCourse: string;
  currentOccupation: string;
  credentialsInField?: string;
  email?: string;
};

type StudentRequest = {
  alumniId: string;
  studentName: string;
  studentEmail: string;
  studentContact: string;
  researchTitle: string;
  researchDescription: string;
  consultationNeeds: string;
};

export default function AlumniDiscoveryPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<StudentRequest>({
    alumniId: "",
    studentName: "",
    studentEmail: "",
    studentContact: "",
    researchTitle: "",
    researchDescription: "",
    consultationNeeds: "",
  });

  // Load alumni
  useEffect(() => {
    async function loadAlumni() {
      try {
        console.log("📍 Alumni Discovery: Fetching alumni from API...");
        const response = await fetch("/api/alumni");
        console.log(
          "📍 Alumni Discovery: API response status:",
          response.status,
        );

        if (response.ok) {
          const data = await response.json();
          console.log("📍 Alumni Discovery: Received data:", {
            count: data.length,
            data,
          });
          setAlumni(data);

          if (data.length === 0) {
            setMessage({
              type: "error",
              text: "No alumni records found in the database. Please check if the CSV migration was successful.",
            });
          }
        } else {
          const errorData = await response.json();
          console.error("❌ API Error:", errorData);
          setMessage({
            type: "error",
            text:
              errorData.error ||
              `API Error: ${response.status} - Failed to load alumni list`,
          });
        }
      } catch (error) {
        console.error("❌ Error loading alumni:", error);
        setMessage({
          type: "error",
          text: `Connection Error: ${error instanceof Error ? error.message : "Failed to load alumni"}`,
        });
      } finally {
        setLoading(false);
      }
    }

    loadAlumni();
  }, []);

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.collegeCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.currentOccupation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectAlumni = (alumnus: Alumni) => {
    setSelectedAlumni(alumnus);
    setShowForm(true);
    setFormData({
      alumniId: alumnus.id,
      studentName: "",
      studentEmail: "",
      studentContact: "",
      researchTitle: "",
      researchDescription: "",
      consultationNeeds: "",
    });
    setMessage(null);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.studentName ||
      !formData.studentEmail ||
      !formData.researchTitle ||
      !formData.consultationNeeds
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/alumni/student-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          alumniEmail: selectedAlumni?.email,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: result.message,
        });
        setFormData({
          alumniId: "",
          studentName: "",
          studentEmail: "",
          studentContact: "",
          researchTitle: "",
          researchDescription: "",
          consultationNeeds: "",
        });
        setShowForm(false);
        setSelectedAlumni(null);
        setTimeout(() => setMessage(null), 5000);
      } else {
        const errorData = await response.json();
        // Keep form open on duplicate request error
        if (errorData.code === "ACTIVE_REQUEST_EXISTS") {
          setMessage({
            type: "error",
            text:
              errorData.error ||
              "You have an active consultation request pending",
          });
        } else {
          setMessage({
            type: "error",
            text: errorData.error || "Failed to send request",
          });
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error sending request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-checkered">
      <HeaderBar title="Find Alumni for Your Research" />

      <main className="flex flex-1 flex-col px-6 py-8">
        {message && (
          <div
            className={`mb-6 mx-auto max-w-6xl rounded-lg p-4 text-center ${
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
          {!showForm ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#B23B3B] mb-4">
                  Search Alumni
                </h2>
                <input
                  type="text"
                  placeholder="Search by name, field of study, or occupation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#A03E2D] rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-2 focus:ring-[#B23B3B]/30"
                />
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-[#A03E2D]">Loading alumni...</p>
                  <p className="text-sm text-[#A03E2D]/70 mt-2">
                    Check browser console for details
                  </p>
                </div>
              ) : filteredAlumni.length === 0 ? (
                <div className="rounded-2xl border-2 border-[#A03E2D] bg-[#FDF4DD] p-12 text-center">
                  <p className="text-lg font-medium text-[#A03E2D]">
                    {alumni.length === 0
                      ? "No alumni records found in database"
                      : "No alumni match your search"}
                  </p>
                  <p className="mt-2 text-sm text-[#A03E2D]/80">
                    {alumni.length === 0
                      ? "The alumni database is empty. Please run the CSV migration script first."
                      : "Try adjusting your search terms"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAlumni.map((alumnus) => (
                    <div
                      key={alumnus.id}
                      className="rounded-xl border-2 border-[#A03E2D] bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                    >
                      <h3 className="text-lg font-bold text-[#B23B3B] mb-2">
                        {alumnus.name}
                      </h3>
                      {alumnus.shsSection && (
                        <p className="text-xs text-[#A03E2D]/70 mb-2">
                          {alumnus.shsSection}
                        </p>
                      )}
                      <p className="text-sm text-[#A03E2D] mb-2">
                        <strong>Field:</strong> {alumnus.collegeCourse}
                      </p>
                      <p className="text-sm text-[#A03E2D] mb-2">
                        <strong>Occupation:</strong> {alumnus.currentOccupation}
                      </p>
                      {alumnus.credentialsInField && (
                        <p className="text-sm text-[#A03E2D] mb-2">
                          <strong>Credentials:</strong>{" "}
                          {alumnus.credentialsInField}
                        </p>
                      )}
                      <button
                        onClick={() => handleSelectAlumni(alumnus)}
                        disabled={!alumnus.email}
                        className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          !alumnus.email
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#B23B3B] text-white hover:bg-[#8B2E2E]"
                        }`}
                      >
                        {!alumnus.email
                          ? "Email needed"
                          : "Request as Consultant"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedAlumni(null);
                }}
                className="mb-4 text-[#A03E2D] hover:text-[#B23B3B] font-medium underline"
              >
                ← Back to Alumni List
              </button>

              <div className="rounded-xl border-2 border-[#A03E2D] bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#B23B3B] mb-2">
                  Request {selectedAlumni?.name}
                </h2>
                <p className="text-[#A03E2D] mb-6">
                  {selectedAlumni?.collegeCourse} •{" "}
                  {selectedAlumni?.currentOccupation}
                </p>

                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#A03E2D] mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#A03E2D] mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="studentEmail"
                        value={formData.studentEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A03E2D] mb-2">
                      Contact Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="studentContact"
                      value={formData.studentContact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                      placeholder="09xxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A03E2D] mb-2">
                      Research Title *
                    </label>
                    <input
                      type="text"
                      name="researchTitle"
                      value={formData.researchTitle}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                      placeholder="Title of your research project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A03E2D] mb-2">
                      Research Description (Optional)
                    </label>
                    <textarea
                      name="researchDescription"
                      value={formData.researchDescription}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                      placeholder="Describe your research project..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A03E2D] mb-2">
                      What You Need From This Alumni *
                    </label>
                    <textarea
                      name="consultationNeeds"
                      value={formData.consultationNeeds}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                      placeholder="e.g., Expert review, industry insights, data validation, interview, etc."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-[#B23B3B] px-6 py-3 text-white font-medium hover:bg-[#8B2E2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {submitting ? "Sending..." : "Send Request"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 rounded-lg border border-[#A03E2D] text-[#A03E2D] font-medium hover:bg-[#A03E2D]/5 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterNav
        leftLabel="School Registrar"
        leftHref="/registrar"
        rightLabel="Home"
        rightHref="/"
      />
    </div>
  );
}
