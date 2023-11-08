import axios from "axios";
import qs from "qs";

const nodeEnv = {
  development: "http://localhost:3333",
  production: "https://api.meupetrecho.com.br",
};

const token = () => localStorage.getItem("token");

export function getApi() {
  return axios.create({
    baseURL: `${nodeEnv["production"]}/api/v1`,
    paramsSerializer: (params) => qs.stringify(params),
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });
}
