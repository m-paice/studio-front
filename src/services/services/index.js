import { getApi } from "../api";

export const serviceResource = {
  findMany: (params = {}) => getApi().get("/services", { params }),
  create: (payload) => getApi().post("/services", payload),
  findById: (id) => getApi().get(`/services/${id}`),
  updateById: (id, payload) => getApi().put(`/services/${id}`, payload),
  deleteById: (id) => getApi().delete(`/services/${id}`),

  findByName: (name) =>
    getApi()
      .get(`/services/search/${name}`)
      .then((response) => response.data),
};
