import { getApi } from "../api";

export const reportsResource = {
  reports: (payload, query = {}) =>
    getApi().post("/reports", payload, {
      params: query,
    }),
  registerOut: (payload) => getApi().post("/reports/register-out", payload),
  destroyById: (id) => getApi().delete(`/reports/${id}`),
};
