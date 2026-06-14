import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const userServices = {
  getAllUsers: (params?: string) =>
    instance.get(`${endpoint.USER}${params ? `?${params}` : ""}`),
  createUser: (payload: any) => instance.post(`${endpoint.USER}`, payload),
};

export default userServices;