import { getApi } from "../api";

export const reportsResource = {
  reports: (payload) => getApi().post("/reports", payload),
};
