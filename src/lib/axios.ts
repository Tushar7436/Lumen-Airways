import axios from "axios";

// Normalize baseURL and provide a sensible default
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
