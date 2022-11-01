import { getApi } from "../api";

export const userResource = {
  auth: (payload) => getApi().post("/auth", payload),
  resetPassword: (payload) => getApi().post("/auth/reset-password", payload),

  findMany: (params) => getApi().get("/users", { params }),
  create: (payload) => getApi().post("/users", payload),
  findById: (id) => getApi().get(`/users/${id}`),
  updateById: (id, payload) => getApi().put(`/users/${id}`, payload),
  deleteById: (id) => getApi().delete(`/users/${id}`),

  findByName: (name) =>
    getApi()
      .get(`/users/search/${name}`)
      .then((response) => response.data),

  findEmployeeByName: (name) =>
    getApi()
      .get(`/users/employee/${name}`)
      .then((response) => response.data),
};
