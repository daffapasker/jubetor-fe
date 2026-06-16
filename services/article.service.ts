import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const articleServices = {
  getAllArticles: (params?: string) =>
    instance.get(`${endpoint.ARTICLE}${params ? `?${params}` : ""}`),
  getArticleById: (id: string) =>
    instance.get(`${endpoint.ARTICLE}/${id}`),
  createArticle: (payload: any, config?: any) =>
    instance.post(`${endpoint.ARTICLE}`, payload, config),
  updateArticle: (id: string, payload: any, config?: any) =>
    instance.put(`${endpoint.ARTICLE}/${id}`, payload, config),
  deleteArticle: (id: string) =>
    instance.delete(`${endpoint.ARTICLE}/${id}`),
};

export default articleServices;
