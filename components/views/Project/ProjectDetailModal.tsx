import projectServices from "@/services/project.service";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import React from "react";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  projectId: string | null;
}

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

const ProjectDetailModal = ({
  isOpen,
  onClose,
  onOpenChange,
  projectId,
}: ProjectDetailModalProps) => {
  // Fetch details using React Query only when open and projectId exists
  const { data: project, isLoading } = useQuery({
    queryKey: ["ProjectDetails", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const res = await projectServices.getProjectById(projectId);
      return res.data;
    },
    enabled: isOpen && !!projectId,
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      size="2xl"
    >
      <ModalContent className="m-4 max-h-[90vh]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="danger" />
          </div>
        ) : !project ? (
          <div className="p-6 text-center">
            <p className="text-zinc-400">Gagal memuat detail proyek.</p>
          </div>
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">
                {project.motorModel}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400 font-normal">
                <span>
                  Plat Nomor: <span className="text-zinc-300">{project.licensePlate || "-"}</span>
                </span>
                <span>
                  Nomor Mesin: <span className="text-zinc-300">{project.engineNumber || "-"}</span>
                </span>
                {project.user && (
                  <span>
                    Pemilik: <span className="text-red-400">{project.user.name}</span>
                  </span>
                )}
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              {/* Status Overview */}
              <div className="mb-6 p-4 bg-zinc-900/40 rounded-lg border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Status Sekarang</span>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Proyek Dimulai</span>
                  <p className="text-white text-sm font-semibold mt-1">
                    {new Date(project.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Complete Timeline logs */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-red-600 rounded-full"></div>
                  Riwayat Aktivitas & Progres
                </h3>

                {!project.logs || project.logs.length === 0 ? (
                  <p className="text-zinc-500 text-sm">Belum ada riwayat aktivitas.</p>
                ) : (
                  <div className="space-y-4">
                    {project.logs
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((log: any, index: number) => (
                        <div key={log.id} className="relative pl-6 pb-2">
                          {/* Timeline Line */}
                          {index !== project.logs.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-zinc-800"></div>
                          )}
                          <div className="relative">
                            {/* Dot */}
                            <div className="absolute -left-[21px] top-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-600/10"></div>
                            </div>
                            <div className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800 hover:border-red-950/40 transition-all duration-300">
                              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(
                                    log.statusName
                                  )}`}
                                >
                                  {log.statusName}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {new Date(log.createdAt).toLocaleString("id-ID", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-300 mt-2 leading-relaxed whitespace-pre-wrap">
                                {log.notes}
                              </p>
                              {log.image && (
                                <div className="mt-3 flex justify-center">
                                  <img
                                    src={log.image}
                                    alt={`${log.statusName} progress`}
                                    className="max-h-80 w-full object-cover rounded-lg border border-zinc-800 hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
                                    onClick={() => window.open(log.image, "_blank")}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-zinc-800">
              <Button
                onClick={onClose}
                className="w-full bg-zinc-800 text-zinc-300 font-semibold"
              >
                Tutup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProjectDetailModal;
