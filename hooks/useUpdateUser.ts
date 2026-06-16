import userServices from "@/services/user.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const editUserSchema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional()
    .min(6, "Password minimal 6 karakter"),
  phoneNumber: yup.string().required("Nomor telepon wajib diisi"),
});

type EditUserFormData = {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
};

const useEditUserModal = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditUserFormData>({
    resolver: yupResolver(editUserSchema) as any,
  });

  const editUser = async ({
    id,
    payload,
  }: {
    id: string;
    payload: EditUserFormData;
  }) => {
    const data: Record<string, string | undefined> = {
      name: payload.name,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    };
    // Only send password if it's provided
    if (payload.password) {
      data.password = payload.password;
    }
    const res = await userServices.updateUser(id, data);
    return res;
  };

  const {
    mutate: mutateEditUser,
    isPending: isPendingMutateEditUser,
    isSuccess: isSuccessMutateEditUser,
  } = useMutation({
    mutationFn: editUser,
    onError(error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal mengupdate pengguna"
      );
    },
    onSuccess: () => {
      toast.success("Pengguna berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["User"] });
      reset();
    },
  });

  const handleEditUser = (id: string, data: EditUserFormData) =>
    mutateEditUser({ id, payload: data });

  return {
    control,
    errors,
    handleEditUser,
    handleSubmit,
    isPendingMutateEditUser,
    isSuccessMutateEditUser,
    reset,
    setValue,
  };
};

export default useEditUserModal;
