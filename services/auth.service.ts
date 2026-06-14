import { ILogin } from "@/types/auth";
import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const authServices = {
  signIn: (payload: ILogin) => instance.post(`${endpoint.AUTH}/sign-in`, payload),
  getProfile: () => instance.get(`${endpoint.AUTH}/profile`),
};

export default authServices;