import { getApi } from "../api";

export const salesResource = {
  findMany: (params) => getApi().get("/sales", { params }),
  create: (payload) => getApi().post("/sales", payload),
  findById: (id) => getApi().get(`/sales/${id}`),
  updateById: (id, payload) => getApi().put(`/sales/${id}`, payload),
  deleteById: (id) => getApi().delete(`/sales/${id}`),

  findByName: (name) =>
    getApi()
      .get(`/sales/search/${name}`)
      .then((response) => response.data),
};
