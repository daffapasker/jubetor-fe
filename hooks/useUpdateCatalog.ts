import catalogServices from "@/services/catalog.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const editCatalogSchema = yup.object().shape({
  name: yup.string().required("Nama katalog wajib diisi"),
  description: yup.string().required("Deskripsi katalog wajib diisi"),
  image: yup.mixed().optional().nullable(),
});

type EditCatalogFormData = {
  name: string;
  description: string;
  image: any;
};

const useEditCatalogModal = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditCatalogFormData>({
    resolver: yupResolver(editCatalogSchema) as any,
  });

  const editCatalog = async ({
    id,
    payload,
  }: {
    id: string;
    payload: EditCatalogFormData;
  }) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    if (payload.image && payload.image[0] instanceof File) {
      formData.append("image", payload.image[0]);
    }

    const res = await catalogServices.updateCatalog(id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  };

  const {
    mutate: mutateEditCatalog,
    isPending: isPendingMutateEditCatalog,
    isSuccess: isSuccessMutateEditCatalog,
  } = useMutation({
    mutationFn: editCatalog,
    onError(error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal mengupdate katalog"
      );
    },
    onSuccess: () => {
      toast.success("Katalog berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["Catalog"] });
      reset();
    },
  });

  const handleEditCatalog = (id: string, data: EditCatalogFormData) =>
    mutateEditCatalog({ id, payload: data });

  return {
    control,
    errors,
    handleEditCatalog,
    handleSubmit,
    isPendingMutateEditCatalog,
    isSuccessMutateEditCatalog,
    reset,
    setValue,
    watch,
  };
};

export default useEditCatalogModal;
