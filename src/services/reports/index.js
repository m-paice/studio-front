import { getApi } from "../api";

export const reportsResource = {
  reports: (payload) => getApi().post("/reports", payload),
  registerOut: (payload) => getApi().post("/reports/register-out", payload),
  destroyById: (id) => getApi().delete(`/reports/${id}`),
};
