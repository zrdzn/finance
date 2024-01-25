import {Axios, AxiosInstance} from "axios"

const api = new Axios({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  }
});

export const useApi = (): Axios => api;