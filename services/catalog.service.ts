import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const catalogServices = {
  getAllCatalogs: (params?: string) =>
    instance.get(`${endpoint.CATALOG}${params ? `?${params}` : ""}`),
  createCatalog: (payload: any, config?: any) =>
    instance.post(`${endpoint.CATALOG}`, payload, config),
  deleteCatalog: (id: string) =>
    instance.delete(`${endpoint.CATALOG}/${id}`),
};

export default catalogServices;
