import axios from "axios";
import qs from "qs";

const nodeEnv = {
  development: "http://localhost:3333",
  production: "http://204.48.31.168:3333",
};

const token = () => localStorage.getItem("token");

export function getApi() {
  return axios.create({
    baseURL: `${nodeEnv["development"]}/api/v1`,
    paramsSerializer: (params) => qs.stringify(params),
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });
}
