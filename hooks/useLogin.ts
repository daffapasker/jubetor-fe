import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import * as yup from "yup";
import { ILogin } from "@/types/auth";
import { authKey } from "@/keys/auth.key";
import authServices from "@/services/auth.service";

// Schema validasi dengan Yup (karena kamu menggunakan yup di package.json)
const loginSchema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
});

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: mutateSignIn, isPending: isPendingSignIn } = useMutation({
    mutationFn: authServices.signIn,
    onError(error: any) {
      const message = error?.response?.data?.message || error.message || "Login failed";
      setError("root", {
        message: message,
      });
      toast.error(message);
    },

    onSuccess: (data) => {

      // Simpan token ke cookie yang bisa dibaca JS (fallback untuk HttpOnly cookie)
      const token = data?.data?.data?.token;
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }

      // Invalidate token / resync user state
      queryClient.invalidateQueries({ queryKey: authKey.me() });
      toast.success("Login successful");
      reset();

      // Cek callbackUrl dari URL Params
      const callbackUrl = searchParams.get("callbackUrl");

      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else {
        // Redirect berdasarkan role dari backend
        const role = data?.data?.data?.user?.role;

        if (role === "client") {
          router.push("/client/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
    },
  });

  const handlerSignIn = handleSubmit((data) => {
    mutateSignIn(data);
  });

  return {
    control,
    handleSubmit,
    setError,
    reset,
    errors,
    handlerSignIn,
    isPendingSignIn,
  };
}