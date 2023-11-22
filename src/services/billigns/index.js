import { getApi } from "../api";

export const billignsResource = {
  findMany: (params) => getApi().get("/billigns", { params }),
};
