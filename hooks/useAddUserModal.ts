import userServices from "@/services/user.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const addUserSchema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  phoneNumber: yup.string().required("Nomor telepon wajib diisi"),
});

type AddUserFormData = yup.InferType<typeof addUserSchema>;

const useAddUserModal = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserFormData>({
    resolver: yupResolver(addUserSchema),
  });

  const addUser = async (payload: AddUserFormData) => {
    const res = await userServices.createUser({
      ...payload,
      role: "client",
    });
    return res;
  };

  const {
    mutate: mutateAddUser,
    isPending: isPendingMutateAddUser,
    isSuccess: isSuccessMutateAddUser,
  } = useMutation({
    mutationFn: addUser,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Pengguna berhasil ditambahkan");
      reset();
    },
  });

  const handleAddUser = (data: AddUserFormData) => mutateAddUser(data);

  return {
    control,
    errors,
    handleAddUser,
    handleSubmit,
    isPendingMutateAddUser,
    isSuccessMutateAddUser,
    reset,
  };
};

export default useAddUserModal;
