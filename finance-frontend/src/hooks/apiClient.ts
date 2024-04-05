import axios, {Axios} from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  }
});

export const useApi = (): Axios => api;