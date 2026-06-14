import catalogServices from "@/services/catalog.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const addCatalogSchema = yup.object().shape({
  name: yup.string().required("Nama katalog wajib diisi"),
  description: yup.string().required("Deskripsi katalog wajib diisi"),
  image: yup.mixed().required("Gambar katalog wajib diisi"),
});

type AddCatalogFormData = {
  name: string;
  description: string;
  image: any;
};

const useAddCatalogModal = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddCatalogFormData>({
    resolver: yupResolver(addCatalogSchema) as any,
  });

  const addCatalog = async (payload: AddCatalogFormData) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    if (payload.image && payload.image[0]) {
      formData.append("image", payload.image[0]);
    }

    const res = await catalogServices.createCatalog(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  };

  const {
    mutate: mutateAddCatalog,
    isPending: isPendingMutateAddCatalog,
    isSuccess: isSuccessMutateAddCatalog,
  } = useMutation({
    mutationFn: addCatalog,
    onError(error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal menambahkan katalog"
      );
    },
    onSuccess: () => {
      toast.success("Katalog berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["Catalog"] });
      reset();
    },
  });

  const handleAddCatalog = (data: AddCatalogFormData) => mutateAddCatalog(data);

  return {
    control,
    errors,
    handleAddCatalog,
    handleSubmit,
    isPendingMutateAddCatalog,
    isSuccessMutateAddCatalog,
    reset,
    setValue,
    watch,
  };
};

export default useAddCatalogModal;
