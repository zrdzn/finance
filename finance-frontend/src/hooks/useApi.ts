import definition from '../api/openapi.json'
import {OpenAPIClientAxios, OpenAPIV3_1} from "openapi-client-axios";
import {Client} from "@/api/api";

const api = new OpenAPIClientAxios({
  definition: definition as OpenAPIV3_1.Document
})

api.init<Client>()

const client = api.getClient<Client>()

client.then(apiClient => {
  apiClient.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
  apiClient.defaults.withCredentials = true
})

export const useApi = () => {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    api: client
  }
};