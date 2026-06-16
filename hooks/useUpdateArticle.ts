import articleServices from "@/services/article.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const editArticleSchema = yup.object().shape({
  title: yup.string().required("Judul artikel wajib diisi"),
  content: yup.string().required("Konten artikel wajib diisi"),
  thumbnail: yup.mixed().optional().nullable(),
});

type EditArticleFormData = {
  title: string;
  content: string;
  thumbnail: any;
};

const useEditArticleModal = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditArticleFormData>({
    resolver: yupResolver(editArticleSchema) as any,
  });

  const editArticle = async ({
    id,
    payload,
  }: {
    id: string;
    payload: EditArticleFormData;
  }) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    if (payload.thumbnail && payload.thumbnail[0] instanceof File) {
      formData.append("thumbnail", payload.thumbnail[0]);
    }

    const res = await articleServices.updateArticle(id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  };

  const {
    mutate: mutateEditArticle,
    isPending: isPendingMutateEditArticle,
    isSuccess: isSuccessMutateEditArticle,
  } = useMutation({
    mutationFn: editArticle,
    onError(error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal mengupdate artikel"
      );
    },
    onSuccess: () => {
      toast.success("Artikel berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["Article"] });
      reset();
    },
  });

  const handleEditArticle = (id: string, data: EditArticleFormData) =>
    mutateEditArticle({ id, payload: data });

  return {
    control,
    errors,
    handleEditArticle,
    handleSubmit,
    isPendingMutateEditArticle,
    isSuccessMutateEditArticle,
    reset,
    setValue,
    watch,
  };
};

export default useEditArticleModal;
