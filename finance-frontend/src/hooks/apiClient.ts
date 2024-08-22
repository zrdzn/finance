import axios, {Axios} from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export const useApi = (): Axios => api;