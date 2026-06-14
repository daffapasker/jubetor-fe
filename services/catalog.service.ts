import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const catalogServices = {
  getAllCatalogs: (params?: string) =>
    instance.get(`${endpoint.CATALOG}${params ? `?${params}` : ""}`),
  createCatalog: (payload: any, config?: any) =>
    instance.post(`${endpoint.CATALOG}`, payload, config),
};

export default catalogServices;
