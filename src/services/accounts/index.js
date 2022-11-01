import { getApi } from "../api";

export const accountResource = {
  findMany: (params) => getApi().get("/accounts", { params }),
  create: (payload) => getApi().post("/accounts", payload),
  findById: (id) => getApi().get(`/accounts/${id}`),
  updateById: (id, payload) => getApi().put(`/accounts/${id}`, payload),
  deleteById: (id) => getApi().delete(`/accounts/${id}`),

  findByName: (name) =>
    getApi()
      .get(`/accounts/search/${name}`)
      .then((response) => response.data),
};
