// TODO: Implement centralized Axios instance
// - Configure baseURL from VITE_API_BASE_URL
// - Set default headers (Content-Type: application/json)
// - Add request/response interceptors
// - Handle auth token injection and error normalization

import axios from 'axios';

const apiClient = axios.create();

export default apiClient;
