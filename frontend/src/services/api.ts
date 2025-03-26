import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
 const apiUrl = import.meta.env.VITE_APP_API_URL
const api: AxiosInstance = axios.create({
  baseURL:  apiUrl,
});

// Add auth token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
});

// Handle 401 unauthorized responses
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;