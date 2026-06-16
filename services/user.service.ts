import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const userServices = {
  getAllUsers: (params?: string) =>
    instance.get(`${endpoint.USER}${params ? `?${params}` : ""}`),
  getUserById: (id: string) =>
    instance.get(`${endpoint.USER}/${id}`),
  createUser: (payload: any) => instance.post(`${endpoint.USER}`, payload),
  updateUser: (id: string, payload: any) =>
    instance.patch(`${endpoint.USER}/${id}`, payload),
  deleteUser: (id: string) =>
    instance.delete(`${endpoint.USER}/${id}`),
};

export default userServices;