import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle session expiration
    if (response && response.status === 401) {
      // Clear local storage and redirect to login if token is invalid
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updatePassword: (passwordData) => api.patch('/auth/password', passwordData),
};

// Cards API
const cardsAPI = {
  getAll: (params) => api.get('/cards', { params }),
  getById: (id) => api.get(`/cards/${id}`),
  create: (cardData) => api.post('/cards', cardData),
  update: (id, cardData) => api.patch(`/cards/${id}`, cardData),
  delete: (id) => api.delete(`/cards/${id}`),
  bulkUpdate: (cardsData) => api.patch('/cards/bulk/update', { cards: cardsData }),
  toggleVisibility: (cardIds, toggleData) => api.patch('/cards/bulk/toggle-visibility', {
    cardIds,
    ...toggleData,
  }),
};

// Prices API
const pricesAPI = {
  getByCardId: (cardId) => api.get(`/prices/card/${cardId}`),
  getById: (id) => api.get(`/prices/${id}`),
  create: (priceData) => api.post('/prices', priceData),
  update: (id, priceData) => api.patch(`/prices/${id}`, priceData),
  bulkUpdate: (pricesData) => api.patch('/prices/bulk/update', { prices: pricesData }),
  toggleVisibility: (priceIds, toggleData) => api.patch('/prices/bulk/toggle-visibility', {
    priceIds,
    ...toggleData,
  }),
};

export { authAPI, cardsAPI, pricesAPI };
export default api;
