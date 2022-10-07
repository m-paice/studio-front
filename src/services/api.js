import axios from "axios";
import qs from "qs";

export function getApi() {
  return axios.create({
    baseURL: "http://204.48.31.168:3333/api/v1",
    paramsSerializer: (params) => qs.stringify(params),
  });
}
