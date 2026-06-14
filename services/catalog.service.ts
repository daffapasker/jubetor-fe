import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const catalogServices = {
  getAllCatalogs: (params?: string) =>
    instance.get(`${endpoint.CATALOG}${params ? `?${params}` : ""}`),
  createCatalog: (payload: any) =>
    instance.post(`${endpoint.CATALOG}`, payload),
};

export default catalogServices;
