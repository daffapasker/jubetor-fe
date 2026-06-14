import projectServices from "@/services/project.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useProject = () => {
  const queryClient = useQueryClient();

  // 1. Query: Get All Projects
  const {
    data: dataProjects,
    isLoading: isLoadingProjects,
    isRefetching: isRefetchingProjects,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ["Projects"],
    queryFn: async () => {
      const res = await projectServices.getAllProjects();
      return res.data; // contains data: Project[], meta: { totalPages, currentPage, etc }
    },
  });

  // 2. Mutation: Create Project
  const { mutate: createProject, isPending: isPendingCreateProject } =
    useMutation({
      mutationFn: projectServices.createProject,
      onSuccess: () => {
        toast.success("Projek berhasil dibuat");
        queryClient.invalidateQueries({ queryKey: ["Projects"] });
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.error ||
            error.message ||
            "Gagal membuat projek"
        );
      },
    });

  // 3. Mutation: Update Project Status (using FormData for image upload)
  const {
    mutate: updateProjectStatus,
    isPending: isPendingUpdateProjectStatus,
  } = useMutation({
    mutationFn: async ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: FormData;
    }) => {
      const res = await projectServices.updateProjectStatus(
        projectId,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Status projek berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["Projects"] });
      if (variables?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["ProjectDetails", variables.projectId],
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Gagal memperbarui status"
      );
    },
  });

  // 4. Mutation: Delete Project
  const { mutate: deleteProject, isPending: isPendingDeleteProject } =
    useMutation({
      mutationFn: projectServices.deleteProject,
      onSuccess: () => {
        toast.success("Projek berhasil dihapus");
        queryClient.invalidateQueries({ queryKey: ["Projects"] });
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.error ||
            error.message ||
            "Gagal menghapus projek"
        );
      },
    });

  return {
    dataProjects,
    isLoadingProjects,
    isRefetchingProjects,
    refetchProjects,

    createProject,
    isPendingCreateProject,

    updateProjectStatus,
    isPendingUpdateProjectStatus,

    deleteProject,
    isPendingDeleteProject,
  };
};

export default useProject;
