import axios from "axios";
import qs from "qs";

const nodeEnv = {
  development: "http://localhost:3333",
  production: "http://204.48.31.168:3333",
};

export function getApi() {
  return axios.create({
    baseURL: `${nodeEnv["production"]}/api/v1`,
    paramsSerializer: (params) => qs.stringify(params),
  });
}
