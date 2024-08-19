import axios from "axios"

export const useApi = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })
}