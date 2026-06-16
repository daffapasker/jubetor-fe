import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const catalogServices = {
  getAllCatalogs: (params?: string) =>
    instance.get(`${endpoint.CATALOG}${params ? `?${params}` : ""}`),
  getCatalogById: (id: string) =>
    instance.get(`${endpoint.CATALOG}/${id}`),
  createCatalog: (payload: any, config?: any) =>
    instance.post(`${endpoint.CATALOG}`, payload, config),
  updateCatalog: (id: string, payload: any, config?: any) =>
    instance.put(`${endpoint.CATALOG}/${id}`, payload, config),
  deleteCatalog: (id: string) =>
    instance.delete(`${endpoint.CATALOG}/${id}`),
};

export default catalogServices;
