import { getApi } from "../api";

export const productResource = {
  findMany: () => getApi().get("/products"),
  create: (payload) => getApi().post("/products", payload),
  findById: (id) => getApi().get(`/products/${id}`),
  updateById: (id, payload) => getApi().put(`/products/${id}`, payload),
  deleteById: (id) => getApi().delete(`/products/${id}`),

  findByName: (name) =>
    getApi()
      .get(`/products/search/${name}`)
      .then((response) => response.data),
};
