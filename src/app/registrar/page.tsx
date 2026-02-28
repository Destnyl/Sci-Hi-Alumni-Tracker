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
  email?: string;
  emailVerified?: boolean;
  needsEmailUpdate?: boolean;
  status: string;
  createdAt?: any;
};

type ApprovedAlumni = {
  id: string;
  name: string;
  strand: string;
  collegeCourse: string;
  currentOccupation: string;
  credentialsInField?: string;
  email?: string;
  emailVerified?: boolean;
  needsEmailUpdate?: boolean;
  status: string;
  createdAt?: any;
  updatedAt?: any;
};

type AlumniFormData = {
  name: string;
  strand: string;
  collegeCourse: string;
  currentOccupation: string;
  credentialsInField: string;
  email: string;
};

type ConsultationFormData = {
  alumniId: string;
  studentName: string;
  studentEmail: string;
  studentContact: string;
  researchTitle: string;
  researchDescription: string;
  consultationNeeds: string;
  expectedDuration: string;
  senderName: string;
};

export default function RegistrarPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [activeTab, setActiveTab] = useState<
    | "pending"
    | "manage"
    | "add"
    | "consultation"
    | "student-requests"
    | "all-consultations"
  >("pending");

  // Pending approvals state
  const [pendingAlumni, setPendingAlumni] = useState<PendingAlumni[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  // Alumni management state
  const [approvedAlumni, setApprovedAlumni] = useState<ApprovedAlumni[]>([]);
  const [managementLoading, setManagementLoading] = useState(false);

  // Form states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Add/Edit form state
  const [formData, setFormData] = useState<AlumniFormData>({
    name: "",
    strand: "",
    collegeCourse: "",
    currentOccupation: "",
    credentialsInField: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<ApprovedAlumni | null>(
    null,
  );

  // Consultation request form state
  const [consultationData, setConsultationData] =
    useState<ConsultationFormData>({
      alumniId: "",
      studentName: "",
      studentEmail: "",
      studentContact: "",
      researchTitle: "",
      researchDescription: "",
      consultationNeeds: "",
      expectedDuration: "",
      senderName: "School Registrar",
    });
  const [consultationHistory, setConsultationHistory] = useState<any[]>([]);
  const [consultationLoading, setConsultationLoading] = useState(false);

  // Student consultation requests state
  const [studentRequests, setStudentRequests] = useState<any[]>([]);
  const [studentRequestsLoading, setStudentRequestsLoading] = useState(false);

  // All consultation requests state
  const [allConsultations, setAllConsultations] = useState<any[]>([]);
  const [allConsultationsLoading, setAllConsultationsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/registrar");
    } else {
      loadPendingRegistrations();
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (activeTab === "manage" && isAuthenticated) {
      loadApprovedAlumni();
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (activeTab === "consultation" && isAuthenticated) {
      loadConsultationHistory();
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (activeTab === "student-requests" && isAuthenticated) {
      loadStudentRequests();
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (activeTab === "all-consultations" && isAuthenticated) {
      loadAllConsultations();
    }
  }, [activeTab, isAuthenticated]);

  async function loadPendingRegistrations() {
    try {
      setPendingLoading(true);
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
      setMessage({ type: "error", text: "Error loading pending data" });
    } finally {
      setPendingLoading(false);
    }
  }

  async function loadApprovedAlumni() {
    try {
      setManagementLoading(true);
      const response = await fetch("/api/alumni/manage");
      if (response.ok) {
        const data = await response.json();
        setApprovedAlumni(data);
      } else {
        setMessage({
          type: "error",
          text: "Failed to load alumni data",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error loading alumni data" });
    } finally {
      setManagementLoading(false);
    }
  }

  async function loadConsultationHistory() {
    try {
      setConsultationLoading(true);
      const response = await fetch("/api/alumni/consultation");
      if (response.ok) {
        const data = await response.json();
        setConsultationHistory(data);
      } else {
        setMessage({
          type: "error",
          text: "Failed to load consultation history",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error loading consultation history" });
    } finally {
      setConsultationLoading(false);
    }
  }

  async function loadStudentRequests() {
    try {
      setStudentRequestsLoading(true);
      const response = await fetch("/api/alumni/student-requests");
      if (response.ok) {
        const data = await response.json();
        setStudentRequests(data);
      } else {
        setMessage({
          type: "error",
          text: "Failed to load student requests",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error loading student requests" });
    } finally {
      setStudentRequestsLoading(false);
    }
  }

  async function loadAllConsultations() {
    try {
      setAllConsultationsLoading(true);
      const [consultationRes, approvedStudentRes] = await Promise.all([
        fetch("/api/alumni/consultation"),
        fetch("/api/alumni/student-requests?status=approved"),
      ]);

      let combined: any[] = [];

      if (consultationRes.ok) {
        const consultations = await consultationRes.json();
        combined = combined.concat(
          consultations.map((c: any) => ({
            ...c,
            type: "direct",
            date: c.sentAt,
          })),
        );
      }

      if (approvedStudentRes.ok) {
        const approvedRequests = await approvedStudentRes.json();
        combined = combined.concat(
          approvedRequests.map((r: any) => ({
            ...r,
            type: "student-initiated",
            date: r.updatedAt || r.createdAt,
          })),
        );
      }

      // Sort by date descending
      combined.sort((a, b) => {
        const dateA = a.date?.seconds
          ? a.date.seconds * 1000
          : new Date(a.date).getTime();
        const dateB = b.date?.seconds
          ? b.date.seconds * 1000
          : new Date(b.date).getTime();
        return dateB - dateA;
      });

      setAllConsultations(combined);
    } catch (error) {
      setMessage({ type: "error", text: "Error loading consultations" });
    } finally {
      setAllConsultationsLoading(false);
    }
  }

  async function handleApproveStudentRequest(
    requestId: string,
    alumniEmail: string,
    alumniName: string,
    studentName: string,
    studentEmail: string,
    researchTitle: string,
    consultationNeeds: string,
  ) {
    setProcessingId(requestId);
    setMessage(null);

    try {
      // Send email to alumni
      const emailResponse = await fetch("/api/alumni/send-student-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumniEmail,
          alumniName,
          studentName,
          studentEmail,
          researchTitle,
          consultationNeeds,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to send email to alumni",
        });
        setProcessingId(null);
        return;
      }

      // Update request status to approved
      const updateResponse = await fetch("/api/alumni/student-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          status: "approved",
        }),
      });

      if (updateResponse.ok) {
        // Also save to consultation history so it appears in Recent Requests
        await fetch("/api/alumni/consultation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alumniId: "student-request", // Mark as student-initiated
            studentName,
            studentEmail,
            researchTitle,
            researchDescription: "",
            consultationNeeds,
            alumniName,
            alumniEmail,
            senderName: "School Registrar",
            sentAt: new Date().toISOString(),
          }),
        }).catch((err) =>
          console.error("Failed to add to consultation history:", err),
        );

        setMessage({
          type: "success",
          text: "Request approved and email sent to alumni successfully!",
        });
        loadStudentRequests(); // Refresh list
      } else {
        setMessage({
          type: "error",
          text: "Email sent but failed to update status",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error processing request" });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRejectStudentRequest(
    requestId: string,
    studentName: string,
  ) {
    if (
      !confirm(
        `Are you sure you want to reject this request from ${studentName}?`,
      )
    ) {
      return;
    }

    setProcessingId(requestId);
    setMessage(null);

    try {
      const response = await fetch("/api/alumni/student-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          status: "rejected",
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Request rejected successfully",
        });
        loadStudentRequests(); // Refresh list
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to reject request",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error rejecting request" });
    } finally {
      setProcessingId(null);
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
        setMessage({
          type: "success",
          text: `${alumniName}'s registration has been ${action}d successfully!`,
        });
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

  async function handleAddAlumni(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.strand ||
      !formData.collegeCourse ||
      !formData.currentOccupation
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/alumni/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Alumni added successfully!" });
        setFormData({
          name: "",
          strand: "",
          collegeCourse: "",
          currentOccupation: "",
          credentialsInField: "",
          email: "",
        });
        // Refresh alumni list if on manage tab
        if (activeTab === "manage") {
          loadApprovedAlumni();
        }
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to add alumni",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error adding alumni" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateAlumni(e: React.FormEvent) {
    e.preventDefault();

    if (
      !editingAlumni ||
      !formData.name ||
      !formData.strand ||
      !formData.collegeCourse ||
      !formData.currentOccupation
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/alumni/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumniId: editingAlumni.id,
          ...formData,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Alumni information updated successfully!",
        });
        setEditingAlumni(null);
        setFormData({
          name: "",
          strand: "",
          collegeCourse: "",
          currentOccupation: "",
          credentialsInField: "",
          email: "",
        });
        loadApprovedAlumni();
        setActiveTab("manage"); // Return to manage tab
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to update alumni",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating alumni" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAlumni(alumniId: string, alumniName: string) {
    if (
      !confirm(
        `Are you sure you want to delete ${alumniName} from the alumni list? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setProcessingId(alumniId);
    setMessage(null);

    try {
      const response = await fetch(`/api/alumni/manage?alumniId=${alumniId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: `${alumniName} has been removed from the alumni list.`,
        });
        loadApprovedAlumni();
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to delete alumni",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error deleting alumni" });
    } finally {
      setProcessingId(null);
    }
  }

  function startEditAlumni(alumni: ApprovedAlumni) {
    setEditingAlumni(alumni);
    setFormData({
      name: alumni.name,
      strand: alumni.strand,
      collegeCourse: alumni.collegeCourse,
      currentOccupation: alumni.currentOccupation,
      credentialsInField: alumni.credentialsInField || "",
      email: alumni.email || "",
    });
    setActiveTab("add"); // Use the same form
  }

  function cancelEdit() {
    setEditingAlumni(null);
    setFormData({
      name: "",
      strand: "",
      collegeCourse: "",
      currentOccupation: "",
      credentialsInField: "",
      email: "",
    });
  }

  async function handleSendConsultationRequest(e: React.FormEvent) {
    e.preventDefault();

    if (
      !consultationData.alumniId ||
      !consultationData.studentName ||
      !consultationData.studentEmail ||
      !consultationData.researchTitle ||
      !consultationData.consultationNeeds
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/alumni/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultationData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: "success", text: result.message });
        setConsultationData({
          alumniId: "",
          studentName: "",
          studentEmail: "",
          studentContact: "",
          researchTitle: "",
          researchDescription: "",
          consultationNeeds: "",
          expectedDuration: "",
          senderName: "School Registrar",
        });
        loadConsultationHistory(); // Refresh history
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to send consultation request",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error sending consultation request" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsultationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setConsultationData((prev) => ({ ...prev, [name]: value }));
  };

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
      <header className="relative overflow-hidden rounded-t-xl bg-gradient-to-b from-[#B23B3B] to-[#8B2E2E] py-8 text-center text-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
        <h1 className="relative z-10 text-xl font-bold text-shadow-lg">
          School Registrar Dashboard
        </h1>
        <p className="relative z-10 mt-2 text-sm text-white/90">
          Manage alumni registrations and data
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b-2 border-[#A03E2D]/20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "pending"
                  ? "border-[#B23B3B] text-[#B23B3B]"
                  : "border-transparent text-[#A03E2D]/60 hover:text-[#A03E2D]"
              }`}
            >
              Pending Approvals ({pendingAlumni.length})
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "manage"
                  ? "border-[#B23B3B] text-[#B23B3B]"
                  : "border-transparent text-[#A03E2D]/60 hover:text-[#A03E2D]"
              }`}
            >
              Manage Alumni
            </button>
            <button
              onClick={() => {
                setActiveTab("add");
                if (editingAlumni) cancelEdit();
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "add"
                  ? "border-[#B23B3B] text-[#B23B3B]"
                  : "border-transparent text-[#A03E2D]/60 hover:text-[#A03E2D]"
              }`}
            >
              {editingAlumni ? "Edit Alumni" : "Add Alumni"}
            </button>
            <button
              onClick={() => setActiveTab("consultation")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "consultation"
                  ? "border-[#B23B3B] text-[#B23B3B]"
                  : "border-transparent text-[#A03E2D]/60 hover:text-[#A03E2D]"
              }`}
            >
              Research Consultation
            </button>
            <button
              onClick={() => setActiveTab("student-requests")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "student-requests"
                  ? "border-[#B23B3B] text-[#B23B3B]"
                  : "border-transparent text-[#A03E2D]/60 hover:text-[#A03E2D]"
              }`}
            >
              Student Requests ({studentRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("all-consultations")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "all-consultations"
                  ? "border-[#B23B3B] text-[#B23B3B]"
                  : "border-transparent text-[#A03E2D]/60 hover:text-[#A03E2D]"
              }`}
            >
              All Consultations ({allConsultations.length})
            </button>
          </div>
        </div>
      </div>

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
          {/* Pending Approvals Tab */}
          {activeTab === "pending" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#B23B3B]">
                  Pending Alumni Registrations ({pendingAlumni.length})
                </h2>
                <button
                  onClick={loadPendingRegistrations}
                  disabled={pendingLoading}
                  className="rounded-lg bg-[#FF7F27] px-4 py-2 text-white font-medium hover:bg-[#E85D04] disabled:opacity-50 transition-colors duration-200"
                >
                  {pendingLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {pendingLoading ? (
                <div className="text-center py-12">
                  <p className="text-[#A03E2D]">
                    Loading pending registrations...
                  </p>
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
                            <strong>Occupation:</strong>{" "}
                            {alumni.currentOccupation}
                          </p>
                          {alumni.credentialsInField && (
                            <p className="text-sm text-[#A03E2D]">
                              <strong>Credentials:</strong>{" "}
                              {alumni.credentialsInField}
                            </p>
                          )}
                          {alumni.email && (
                            <p className="text-sm text-[#A03E2D]">
                              <strong>Email:</strong> {alumni.email}
                              {alumni.needsEmailUpdate && (
                                <span className="text-xs text-orange-600 ml-2">
                                  (needs update)
                                </span>
                              )}
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
                            handleApproveReject(
                              alumni.id,
                              "approve",
                              alumni.name,
                            )
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
                            handleApproveReject(
                              alumni.id,
                              "reject",
                              alumni.name,
                            )
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
            </>
          )}

          {/* Alumni Management Tab */}
          {activeTab === "manage" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#B23B3B]">
                  Alumni Management ({approvedAlumni.length} approved)
                </h2>
                <button
                  onClick={loadApprovedAlumni}
                  disabled={managementLoading}
                  className="rounded-lg bg-[#FF7F27] px-4 py-2 text-white font-medium hover:bg-[#E85D04] disabled:opacity-50 transition-colors duration-200"
                >
                  {managementLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {managementLoading ? (
                <div className="text-center py-12">
                  <p className="text-[#A03E2D]">Loading alumni data...</p>
                </div>
              ) : approvedAlumni.length === 0 ? (
                <div className="rounded-2xl border-2 border-[#A03E2D] bg-[#FDF4DD] p-12 text-center">
                  <p className="text-lg font-medium text-[#A03E2D]">
                    No approved alumni records found.
                  </p>
                  <p className="mt-2 text-sm text-[#A03E2D]/80">
                    Approve pending registrations or add alumni directly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedAlumni.map((alumni) => (
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
                            <strong>Occupation:</strong>{" "}
                            {alumni.currentOccupation}
                          </p>
                          {alumni.credentialsInField && (
                            <p className="text-sm text-[#A03E2D]">
                              <strong>Credentials:</strong>{" "}
                              {alumni.credentialsInField}
                            </p>
                          )}
                          {alumni.email && (
                            <p className="text-sm text-[#A03E2D]">
                              <strong>Email:</strong> {alumni.email}
                              {alumni.needsEmailUpdate && (
                                <span className="text-xs text-orange-600 ml-2">
                                  (needs update)
                                </span>
                              )}
                            </p>
                          )}
                          <p className="text-xs text-[#A03E2D]/70 mt-2">
                            <strong>Added:</strong>{" "}
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
                          onClick={() => startEditAlumni(alumni)}
                          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteAlumni(alumni.id, alumni.name)
                          }
                          disabled={processingId === alumni.id}
                          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {processingId === alumni.id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Add/Edit Alumni Tab */}
          {activeTab === "add" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#B23B3B]">
                  {editingAlumni
                    ? `Edit Alumni: ${editingAlumni.name}`
                    : "Add New Alumni"}
                </h2>
                {editingAlumni && (
                  <button
                    onClick={cancelEdit}
                    className="rounded-lg bg-gray-500 px-4 py-2 text-white font-medium hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="rounded-xl border-2 border-[#A03E2D] bg-white p-8 shadow-lg">
                <form
                  onSubmit={
                    editingAlumni ? handleUpdateAlumni : handleAddAlumni
                  }
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
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
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="strand"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
                      >
                        Strand *
                      </label>
                      <select
                        id="strand"
                        name="strand"
                        value={formData.strand}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                      >
                        <option value="">Select strand</option>
                        <option value="ABM">ABM</option>
                        <option value="STEM">STEM</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="collegeCourse"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
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
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="e.g., BS Computer Science"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="currentOccupation"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
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
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="e.g., Software Developer"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
                      >
                        Email Address *
                        <span className="text-xs text-[#FF7F27] ml-1">
                          (Required for consultation requests)
                        </span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="alumni@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="credentialsInField"
                      className="block text-sm font-medium text-[#A03E2D] mb-2"
                    >
                      Credentials in Field (Optional)
                    </label>
                    <textarea
                      id="credentialsInField"
                      name="credentialsInField"
                      value={formData.credentialsInField}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                      placeholder="Any certifications, licenses, or special credentials..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-lg bg-[#B23B3B] px-6 py-3 text-white font-medium hover:bg-[#8B2E2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isSubmitting
                        ? editingAlumni
                          ? "Updating..."
                          : "Adding..."
                        : editingAlumni
                          ? "Update Alumni"
                          : "Add Alumni"}
                    </button>

                    {editingAlumni && (
                      <button
                        type="button"
                        onClick={() => {
                          cancelEdit();
                          setActiveTab("manage");
                        }}
                        className="px-6 py-3 rounded-lg border border-[#A03E2D] text-[#A03E2D] font-medium hover:bg-[#A03E2D]/5 transition-colors duration-200"
                      >
                        Cancel & Return
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Research Consultation Tab */}
          {activeTab === "consultation" && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#B23B3B] mb-4">
                  Research Consultation Requests
                </h2>
                <p className="text-[#A03E2D]/80 text-sm">
                  Send consultation requests to alumni for student research
                  projects. Alumni will receive detailed emails with student
                  contact information and research requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Consultation Request Form */}
                <div className="rounded-xl border-2 border-[#A03E2D] bg-white p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-[#B23B3B] mb-4">
                    Send Consultation Request
                  </h3>

                  <form
                    onSubmit={handleSendConsultationRequest}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="consultation-alumni"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
                      >
                        Select Alumni *
                      </label>
                      <select
                        id="consultation-alumni"
                        name="alumniId"
                        value={consultationData.alumniId}
                        onChange={handleConsultationChange}
                        required
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                      >
                        <option value="">Choose alumni to contact...</option>
                        {approvedAlumni
                          .filter(
                            (alumni) =>
                              alumni.email && alumni.email.trim() !== "",
                          )
                          .map((alumni) => (
                            <option key={alumni.id} value={alumni.id}>
                              {alumni.name} - {alumni.collegeCourse} (
                              {alumni.currentOccupation})
                            </option>
                          ))}
                      </select>
                      {approvedAlumni.filter(
                        (alumni) => alumni.email && alumni.email.trim() !== "",
                      ).length === 0 && (
                        <p className="text-xs text-[#A03E2D]/60 mt-1">
                          ⚠️ No approved alumni with email addresses found. Add
                          or update alumni records with email addresses to send
                          consultation requests.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="student-name"
                          className="block text-sm font-medium text-[#A03E2D] mb-2"
                        >
                          Student Name *
                        </label>
                        <input
                          type="text"
                          id="student-name"
                          name="studentName"
                          value={consultationData.studentName}
                          onChange={handleConsultationChange}
                          required
                          className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                          placeholder="Student's full name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="student-email"
                          className="block text-sm font-medium text-[#A03E2D] mb-2"
                        >
                          Student Email *
                        </label>
                        <input
                          type="email"
                          id="student-email"
                          name="studentEmail"
                          value={consultationData.studentEmail}
                          onChange={handleConsultationChange}
                          required
                          className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                          placeholder="student@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="student-contact"
                          className="block text-sm font-medium text-[#A03E2D] mb-2"
                        >
                          Student Contact (Optional)
                        </label>
                        <input
                          type="text"
                          id="student-contact"
                          name="studentContact"
                          value={consultationData.studentContact}
                          onChange={handleConsultationChange}
                          className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                          placeholder="Phone number or other contact"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="expected-duration"
                          className="block text-sm font-medium text-[#A03E2D] mb-2"
                        >
                          Expected Duration (Optional)
                        </label>
                        <input
                          type="text"
                          id="expected-duration"
                          name="expectedDuration"
                          value={consultationData.expectedDuration}
                          onChange={handleConsultationChange}
                          className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                          placeholder="e.g., 2-3 weeks, 1 month"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="research-title"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
                      >
                        Research Title *
                      </label>
                      <input
                        type="text"
                        id="research-title"
                        name="researchTitle"
                        value={consultationData.researchTitle}
                        onChange={handleConsultationChange}
                        required
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="Title of the research project"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="research-description"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
                      >
                        Research Description (Optional)
                      </label>
                      <textarea
                        id="research-description"
                        name="researchDescription"
                        value={consultationData.researchDescription}
                        onChange={handleConsultationChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="Brief description of the research project, objectives, methodology, etc."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="consultation-needs"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
                      >
                        What We Need From Alumni *
                      </label>
                      <textarea
                        id="consultation-needs"
                        name="consultationNeeds"
                        value={consultationData.consultationNeeds}
                        onChange={handleConsultationChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="Specific consultation needs: expertise validation, industry insights, data review, interview participation, etc."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sender-name"
                        className="block text-sm font-medium text-[#A03E2D] mb-2"
                      >
                        Sender Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="sender-name"
                        name="senderName"
                        value={consultationData.senderName}
                        onChange={handleConsultationChange}
                        className="w-full px-3 py-2 border border-[#A03E2D]/30 rounded-lg focus:outline-none focus:border-[#B23B3B] focus:ring-1 focus:ring-[#B23B3B]"
                        placeholder="Your name or title"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-[#B23B3B] px-6 py-3 text-white font-medium hover:bg-[#8B2E2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isSubmitting
                        ? "Sending Request..."
                        : "📧 Send Consultation Request"}
                    </button>
                  </form>
                </div>

                {/* Consultation History */}
                <div className="rounded-xl border-2 border-[#A03E2D] bg-white p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B23B3B]">
                      Recent Requests ({consultationHistory.length})
                    </h3>
                    <button
                      onClick={loadConsultationHistory}
                      disabled={consultationLoading}
                      className="rounded-lg bg-[#FF7F27] px-3 py-1 text-white text-sm font-medium hover:bg-[#E85D04] disabled:opacity-50 transition-colors duration-200"
                    >
                      {consultationLoading ? "Loading..." : "Refresh"}
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {consultationLoading ? (
                      <div className="text-center py-8">
                        <p className="text-[#A03E2D]">
                          Loading consultation history...
                        </p>
                      </div>
                    ) : consultationHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[#A03E2D]/60">
                          No consultation requests sent yet.
                        </p>
                      </div>
                    ) : (
                      consultationHistory.map((request) => (
                        <div
                          key={request.id}
                          className="border border-[#A03E2D]/20 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-[#B23B3B] text-sm">
                              {request.researchTitle}
                            </h4>
                            <span className="text-xs text-[#A03E2D]/70">
                              {new Date(
                                request.sentAt.seconds * 1000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-[#A03E2D] space-y-1">
                            <p>
                              <strong>Alumni:</strong> {request.alumniName}
                            </p>
                            <p>
                              <strong>Student:</strong> {request.studentName}
                            </p>
                            <p>
                              <strong>Email:</strong> {request.alumniEmail}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Student Requests Tab */}
          {activeTab === "student-requests" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#B23B3B]">
                  Student Alumni Requests ({studentRequests.length})
                </h2>
                <button
                  onClick={loadStudentRequests}
                  disabled={studentRequestsLoading}
                  className="rounded-lg bg-[#FF7F27] px-4 py-2 text-white font-medium hover:bg-[#E85D04] disabled:opacity-50 transition-colors duration-200"
                >
                  {studentRequestsLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              <p className="text-[#A03E2D] mb-6">
                View all student consultation requests. Manage pending requests,
                view approved ones that have been sent to alumni, or review
                rejected requests.
              </p>

              {studentRequestsLoading ? (
                <div className="text-center py-12">
                  <p className="text-[#A03E2D]">Loading student requests...</p>
                </div>
              ) : studentRequests.length === 0 ? (
                <div className="rounded-2xl border-2 border-[#A03E2D] bg-[#FDF4DD] p-12 text-center">
                  <p className="text-lg font-medium text-[#A03E2D]">
                    📭 No student requests yet
                  </p>
                  <p className="mt-2 text-sm text-[#A03E2D]/80">
                    Student requests will appear here once they submit them.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border-2 border-[#A03E2D] bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-[#B23B3B]">
                            {request.researchTitle}
                          </h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              request.status === "pending"
                                ? "bg-blue-100 text-blue-800"
                                : request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.status === "pending"
                              ? "⏳ Pending"
                              : request.status === "approved"
                                ? "✅ Approved"
                                : "❌ Rejected"}
                          </span>
                        </div>
                        <p className="text-sm text-[#A03E2D]/80 mb-3">
                          {request.researchDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-xs text-[#A03E2D]/70 font-medium mb-1">
                            Student
                          </p>
                          <p className="font-semibold text-[#B23B3B] text-sm">
                            {request.studentName}
                          </p>
                          <p className="text-xs text-[#A03E2D] mt-1">
                            {request.studentEmail}
                          </p>
                          {request.studentContact && (
                            <p className="text-xs text-[#A03E2D] mt-1">
                              {request.studentContact}
                            </p>
                          )}
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-xs text-[#A03E2D]/70 font-medium mb-1">
                            Requested Alumni
                          </p>
                          <p className="font-semibold text-[#B23B3B] text-sm">
                            {request.alumniName}
                          </p>
                          <p className="text-xs text-[#A03E2D] mt-1">
                            {request.alumniEmail}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 rounded-lg bg-[#FDF4DD] p-3 border border-[#FF7F27]/20">
                        <p className="text-xs text-[#A03E2D]/70 font-medium mb-1">
                          What They Need
                        </p>
                        <p className="text-sm text-[#A03E2D]">
                          {request.consultationNeeds}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        {request.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleApproveStudentRequest(
                                  request.id,
                                  request.alumniEmail,
                                  request.alumniName,
                                  request.studentName,
                                  request.studentEmail,
                                  request.researchTitle,
                                  request.consultationNeeds,
                                )
                              }
                              disabled={processingId === request.id}
                              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              {processingId === request.id
                                ? "Approving..."
                                : "✓ Approve & Email Alumni"}
                            </button>
                            <button
                              onClick={() =>
                                handleRejectStudentRequest(
                                  request.id,
                                  request.studentName,
                                )
                              }
                              disabled={processingId === request.id}
                              className="rounded-lg border-2 border-red-500 text-red-600 px-4 py-2 font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              {processingId === request.id
                                ? "Rejecting..."
                                : "✗ Reject"}
                            </button>
                          </>
                        ) : request.status === "approved" ? (
                          <div className="w-full rounded-lg bg-green-50 border-2 border-green-300 p-3 text-center">
                            <p className="text-sm font-medium text-green-800">
                              ✅ Approved & Email sent to alumni
                            </p>
                          </div>
                        ) : (
                          <div className="w-full rounded-lg bg-red-50 border-2 border-red-300 p-3 text-center">
                            <p className="text-sm font-medium text-red-800">
                              ❌ Rejected
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* All Consultations Tab */}
          {activeTab === "all-consultations" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#B23B3B]">
                  All Consultation Requests ({allConsultations.length})
                </h2>
                <button
                  onClick={loadAllConsultations}
                  disabled={allConsultationsLoading}
                  className="rounded-lg bg-[#FF7F27] px-4 py-2 text-white font-medium hover:bg-[#E85D04] disabled:opacity-50 transition-colors duration-200"
                >
                  {allConsultationsLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              <p className="text-[#A03E2D] mb-6">
                View all consultation requests to alumni, including both direct
                registrar requests and student-initiated requests that have been
                approved.
              </p>

              {allConsultationsLoading ? (
                <div className="text-center py-12">
                  <p className="text-[#A03E2D]">Loading consultations...</p>
                </div>
              ) : allConsultations.length === 0 ? (
                <div className="rounded-2xl border-2 border-[#A03E2D] bg-[#FDF4DD] p-12 text-center">
                  <p className="text-lg font-medium text-[#A03E2D]">
                    📭 No consultation requests yet
                  </p>
                  <p className="mt-2 text-sm text-[#A03E2D]/80">
                    Consultation requests will appear here once they are sent or
                    approved.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allConsultations.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border-2 border-[#A03E2D] bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#B23B3B] mb-2">
                            {request.researchTitle}
                          </h3>
                          {request.researchDescription && (
                            <p className="text-sm text-[#A03E2D]/80 mb-3">
                              {request.researchDescription}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              request.type === "direct"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {request.type === "direct"
                              ? "Direct Request"
                              : "Student Initiated"}
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            Approved ✓
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="rounded-lg bg-gray-50 p-4">
                          <p className="text-xs text-[#A03E2D]/70 font-medium mb-2">
                            Student
                          </p>
                          <p className="font-semibold text-[#B23B3B]">
                            {request.studentName}
                          </p>
                          <p className="text-sm text-[#A03E2D] mt-1">
                            {request.studentEmail}
                          </p>
                          {request.studentContact && (
                            <p className="text-sm text-[#A03E2D] mt-1">
                              {request.studentContact}
                            </p>
                          )}
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                          <p className="text-xs text-[#A03E2D]/70 font-medium mb-2">
                            Alumni
                          </p>
                          <p className="font-semibold text-[#B23B3B]">
                            {request.alumniName}
                          </p>
                          <p className="text-sm text-[#A03E2D] mt-1">
                            {request.alumniEmail}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 rounded-lg bg-[#FDF4DD] p-4 border border-[#FF7F27]/20">
                        <p className="text-xs text-[#A03E2D]/70 font-medium mb-2">
                          Consultation Needs
                        </p>
                        <p className="text-sm text-[#A03E2D]">
                          {request.consultationNeeds}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#A03E2D]/20 text-xs text-[#A03E2D]/70">
                        <span>
                          📧 Sent on{" "}
                          {request.date?.seconds
                            ? new Date(
                                request.date.seconds * 1000,
                              ).toLocaleDateString()
                            : "Recently"}
                        </span>
                        {request.expectedDuration && (
                          <span>⏱️ Expected: {request.expectedDuration}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
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
