"use client";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AddProject from "@/components/views/Project/AddProject";
import UpdateProjectStatus from "@/components/views/Project/UpdateProjectStatus";
import ProjectDetailModal from "@/components/views/Project/ProjectDetailModal";
import useProject from "@/hooks/useProject";
import { Button, Spinner, useDisclosure } from "@heroui/react";
import React, { useState } from "react";

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    QUEUE: "bg-zinc-800 text-zinc-400 border-zinc-700",
    STRIPPING: "bg-amber-900/50 text-amber-400 border-amber-700",
    ENGINE: "bg-blue-900/50 text-blue-400 border-blue-700",
    PAINTING: "bg-purple-900/50 text-purple-400 border-purple-700",
    ASSEMBLY: "bg-indigo-900/50 text-indigo-400 border-indigo-700",
    DONE: "bg-green-900/50 text-green-400 border-green-700",
    CANCELED: "bg-red-900/50 text-red-400 border-red-700",
  };
  return colors[status] || "bg-gray-800 text-gray-400 border-gray-700";
};

// Map status to progress step index (1-based)
const getStatusStepIndex = (status: string) => {
  const steps = ["QUEUE", "STRIPPING", "ENGINE", "PAINTING", "ASSEMBLY", "DONE"];
  const index = steps.indexOf(status);
  return index === -1 ? 0 : index; // 0 for QUEUE/CANCELED, 1 for STRIPPING, etc.
};

const getStepLabel = (step: string) => {
  const labels: Record<string, string> = {
    QUEUE: "Antrean",
    STRIPPING: "Bongkar",
    ENGINE: "Mesin",
    PAINTING: "Cat",
    ASSEMBLY: "Rakit",
    DONE: "Selesai",
  };
  return labels[step] || step;
};

export default function AdminDashboardPage() {
  const {
    dataProjects,
    isLoadingProjects,
    isRefetchingProjects,
    deleteProject,
    isPendingDeleteProject,
  } = useProject();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
    onOpenChange: onAddOpenChange,
  } = useDisclosure();

  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose,
    onOpenChange: onStatusOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
    onOpenChange: onDetailOpenChange,
  } = useDisclosure();

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailProjectId, setDetailProjectId] = useState<string | null>(null);

  const handleOpenStatusModal = (project: any) => {
    setSelectedProject(project);
    onStatusOpen();
  };

  const handleOpenDetailModal = (projectId: string) => {
    setDetailProjectId(projectId);
    onDetailOpen();
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      deleteProject(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const projects = dataProjects?.data || [];

  return (
    <section className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Manajemen Proyek Motor
          </h1>
          <p className="text-zinc-400 mt-1">
            Pantau dan perbarui progres modifikasi motor pelanggan secara real-time.
          </p>
        </div>
        <Button
          onPress={onAddOpen}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          size="md"
        >
          Tambah Proyek
        </Button>
      </div>

      {/* Loading state */}
      {isLoadingProjects || isRefetchingProjects ? (
        <div className="flex justify-center items-center py-32">
          <Spinner size="lg" color="danger" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800">
          <p className="text-zinc-500 text-lg">Belum ada proyek pengerjaan motor.</p>
        </div>
      ) : (
        /* Project Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project: any) => {
            const currentStepIdx = getStatusStepIndex(project.status);

            return (
              <div
                key={project.id || project._id}
                className="group bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5 overflow-hidden flex flex-col h-full"
              >
                {/* Project Header */}
                <div className="bg-black px-6 py-4 border-b border-zinc-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                        {project.motorModel}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 mt-2 text-sm text-zinc-400">
                        <span>
                          Plat: <span className="text-zinc-300">{project.licensePlate || "-"}</span>
                        </span>
                        <span>
                          Mesin: <span className="text-zinc-300">{project.engineNumber || "-"}</span>
                        </span>
                        {project.user && (
                          <span>
                            Pemilik: <span className="text-red-400">{project.user.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                      <span className="text-xs text-zinc-500 whitespace-nowrap">
                        {new Date(project.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="px-6 pt-6">
                  <h4 className="font-semibold text-zinc-300 mb-4 text-xs uppercase tracking-wider">
                    Progress Timeline
                  </h4>
                  <div className="relative">
                    <div className="flex justify-between mb-2">
                      {["STRIPPING", "ENGINE", "PAINTING", "ASSEMBLY", "DONE"].map(
                        (step, idx) => {
                          const stepNumber = idx + 1;
                          const isCompleted = currentStepIdx > stepNumber;
                          const isCurrent = project.status === step;

                          return (
                            <div
                              key={step}
                              className="flex flex-col items-center flex-1"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isCompleted
                                    ? "bg-red-600 text-white ring-2 ring-red-500/50"
                                    : isCurrent
                                      ? "bg-red-600 text-white ring-4 ring-red-500/30 animate-pulse"
                                      : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                                }`}
                              >
                                {stepNumber}
                              </div>
                              <span
                                className={`text-[10px] mt-2 text-center truncate max-w-[70px] ${
                                  isCurrent
                                    ? "font-bold text-red-500"
                                    : "text-zinc-500"
                                }`}
                              >
                                {getStepLabel(step)}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 py-4 border-t border-zinc-800 mt-auto flex gap-3">
                  <Button
                    onClick={() => handleOpenStatusModal(project)}
                    className="flex-1 bg-red-600 text-white font-bold"
                    size="sm"
                  >
                    Update Status
                  </Button>
                  <Button
                    onClick={() => handleOpenDetailModal(project.id || project._id)}
                    className="font-bold border-zinc-700 hover:border-red-600/50 hover:text-red-500"
                    variant="bordered"
                    size="sm"
                  >
                    Detail
                  </Button>
                  <Button
                    onClick={() => setDeleteId(project.id || project._id)}
                    className="font-bold border-zinc-700 hover:border-red-600/50 hover:text-red-500"
                    variant="bordered"
                    size="sm"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
      <AddProject
        isOpen={isAddOpen}
        onClose={onAddClose}
        onOpenChange={onAddOpenChange}
      />

      {/* Update Status Modal */}
      <UpdateProjectStatus
        isOpen={isStatusOpen}
        onClose={onStatusClose}
        onOpenChange={onStatusOpenChange}
        project={selectedProject}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isPendingDeleteProject}
        title="Hapus Proyek Motor"
        message="Apakah Anda yakin ingin menghapus proyek motor ini? Tindakan ini akan menghapus semua riwayat pengerjaan proyek secara permanen."
        confirmLabel="Hapus"
      />

      {/* Project Detail History Modal */}
      <ProjectDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        onOpenChange={onDetailOpenChange}
        projectId={detailProjectId}
      />
    </section>
  );
}