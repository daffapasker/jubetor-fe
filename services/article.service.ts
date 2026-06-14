import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const articleServices = {
  getAllArticles: (params?: string) =>
    instance.get(`${endpoint.ARTICLE}${params ? `?${params}` : ""}`),
  createArticle: (payload: any) =>
    instance.post(`${endpoint.ARTICLE}`, payload),
};

export default articleServices;
