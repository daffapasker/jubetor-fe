import articleServices from "@/services/article.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const addArticleSchema = yup.object().shape({
  title: yup.string().required("Judul artikel wajib diisi"),
  content: yup.string().required("Konten artikel wajib diisi"),
  thumbnail: yup.mixed().required("Thumbnail artikel wajib diisi"),
});

type AddArticleFormData = {
  title: string;
  content: string;
  thumbnail: any;
};

const useAddArticleModal = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddArticleFormData>({
    resolver: yupResolver(addArticleSchema) as any,
  });

  const addArticle = async (payload: AddArticleFormData) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    if (payload.thumbnail && payload.thumbnail[0]) {
      formData.append("thumbnail", payload.thumbnail[0]);
    }

    const res = await articleServices.createArticle(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  };

  const {
    mutate: mutateAddArticle,
    isPending: isPendingMutateAddArticle,
    isSuccess: isSuccessMutateAddArticle,
  } = useMutation({
    mutationFn: addArticle,
    onError(error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal menambahkan artikel"
      );
    },
    onSuccess: () => {
      toast.success("Artikel berhasil ditambahkan");
      reset();
    },
  });

  const handleAddArticle = (data: AddArticleFormData) => mutateAddArticle(data);

  return {
    control,
    errors,
    handleAddArticle,
    handleSubmit,
    isPendingMutateAddArticle,
    isSuccessMutateAddArticle,
    reset,
    setValue,
    watch,
  };
};

export default useAddArticleModal;
