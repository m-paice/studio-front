import { getApi } from "../api";

export const scheduleResource = {
  findMany: (params = {}) => getApi().get("/schedules", { params }),
  create: (payload) => getApi().post("/schedules", payload),
  findById: (id) => getApi().get(`/schedules/${id}`),
  updateById: (id, payload) => getApi().put(`/schedules/${id}`, payload),
  deleteById: (id) => getApi().delete(`/schedules/${id}`),

  changeStatus: (id, payload) =>
    getApi().put(`/schedules/${id}/status`, payload),
  revert: (id) => getApi().get(`/schedules/${id}/revert`),
};
