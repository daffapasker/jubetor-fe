import endpoint from "./endpoint.constant";
import { instance } from "@/lib/axios";

const projectServices = {
  getAllProjects: (params?: string) =>
    instance.get(`${endpoint.PROJECT}${params ? `?${params}` : ""}`),
  getProjectById: (projectId: string) =>
    instance.get(`${endpoint.PROJECT}/${projectId}`),
  createProject: (payload: any, config?: any) =>
    instance.post(`${endpoint.PROJECT}`, payload, config),
  updateProjectStatus: (projectId: string, payload: any, config?: any) =>
    instance.patch(`${endpoint.PROJECT}/${projectId}/status`, payload, config),
  deleteProject: (projectId: string) =>
    instance.delete(`${endpoint.PROJECT}/${projectId}`),
};

export default projectServices;
