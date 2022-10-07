import { getApi } from "../api";

export const categoryResource = {
  findMany: () => getApi().get("/categories"),
  create: (payload) => getApi().post("/categories", payload),
  findById: (id) => getApi().get(`/categories/${id}`),
  updateById: (id, payload) => getApi().put(`/categories/${id}`, payload),
  deleteById: (id) => getApi().delete(`/categories/${id}`),

  findByName: (name) =>
    getApi()
      .get(`/categories/search/${name}`)
      .then((response) => response.data),
};
