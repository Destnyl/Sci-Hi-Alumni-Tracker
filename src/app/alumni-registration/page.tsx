"use client";

import { useState, FormEvent } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { FooterNav } from "@/components/FooterNav";

export default function AlumniRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    strand: "",
    collegeCourse: "",
    currentOccupation: "",
    credentialsInField: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.strand ||
      !formData.collegeCourse ||
      !formData.currentOccupation
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/alumni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage({
          type: "success",
          text:
            responseData.message ||
            "Thank you! Your registration has been submitted and is pending approval by the school registrar.",
        });
        // Reset form
        setFormData({
          name: "",
          strand: "",
          collegeCourse: "",
          currentOccupation: "",
          credentialsInField: "",
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text:
            errorData.error ||
            "Failed to submit your information. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-checkered">
      <HeaderBar title="Alumni Registration - Science High School Alumni Network" />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-2xl border-2 border-[#B23B3B] bg-white/95 backdrop-blur-sm p-8 shadow-xl shadow-brand-lg animate-fade-in">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#B23B3B] text-shadow">
            Alumni Registration
          </h2>

          <p className="mb-6 text-center text-[#A03E2D]">
            Welcome, SciHi alumni! Please share your information to help us
            maintain our alumni network.
          </p>

          {message && (
            <div
              className={`mb-6 rounded-lg p-4 text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#A03E2D] mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-[#A03E2D] bg-[#FDF4DD] px-4 py-2 text-[#A03E2D] placeholder-[#A03E2D]/70 focus:outline-none focus:ring-2 focus:ring-[#FF7F27]"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="strand"
                className="block text-sm font-medium text-[#A03E2D] mb-1"
              >
                Strand *
              </label>
              <select
                id="strand"
                name="strand"
                value={formData.strand}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-[#A03E2D] bg-[#FDF4DD] px-4 py-2 text-[#A03E2D] focus:outline-none focus:ring-2 focus:ring-[#FF7F27]"
              >
                <option value="">Select your strand</option>
                <option value="ABM">
                  ABM (Accountancy, Business and Management)
                </option>
                <option value="STEM">
                  STEM (Science, Technology, Engineering and Mathematics)
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="collegeCourse"
                className="block text-sm font-medium text-[#A03E2D] mb-1"
              >
                College Course *
              </label>
              <input
                type="text"
                id="collegeCourse"
                name="collegeCourse"
                value={formData.collegeCourse}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-[#A03E2D] bg-[#FDF4DD] px-4 py-2 text-[#A03E2D] placeholder-[#A03E2D]/70 focus:outline-none focus:ring-2 focus:ring-[#FF7F27]"
                placeholder="e.g., Computer Science, Nursing, Engineering"
              />
            </div>

            <div>
              <label
                htmlFor="currentOccupation"
                className="block text-sm font-medium text-[#A03E2D] mb-1"
              >
                Current Occupation *
              </label>
              <input
                type="text"
                id="currentOccupation"
                name="currentOccupation"
                value={formData.currentOccupation}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-[#A03E2D] bg-[#FDF4DD] px-4 py-2 text-[#A03E2D] placeholder-[#A03E2D]/70 focus:outline-none focus:ring-2 focus:ring-[#FF7F27]"
                placeholder="e.g., Software Developer, Teacher, Entrepreneur"
              />
            </div>

            <div>
              <label
                htmlFor="credentialsInField"
                className="block text-sm font-medium text-[#A03E2D] mb-1"
              >
                Credentials/Certifications (Optional)
              </label>
              <textarea
                id="credentialsInField"
                name="credentialsInField"
                value={formData.credentialsInField}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border-2 border-[#A03E2D] bg-[#FDF4DD] px-4 py-2 text-[#A03E2D] placeholder-[#A03E2D]/70 focus:outline-none focus:ring-2 focus:ring-[#FF7F27]"
                placeholder="e.g., Licensed Engineer, CPA, Google Cloud Certified"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl py-3 font-bold text-white text-shadow-lg transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FF7F27] via-[#FF6B1A] to-[#E85D04] hover:scale-[1.02] hover:shadow-lg shadow-orange-500/30"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#A03E2D]/80">
            * Required fields
          </div>
        </div>
      </main>

      <FooterNav
        leftLabel="Back to Home"
        leftHref="/"
        rightLabel="T.R.A.C.E."
        rightHref="/trace"
      />
    </div>
  );
}
