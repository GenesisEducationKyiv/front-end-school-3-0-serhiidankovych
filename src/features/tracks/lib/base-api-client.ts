import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
