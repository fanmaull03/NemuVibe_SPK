import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ── Auth ──────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser    = (data) => api.post('/auth/login', data);

// ── Cafes ────────────────────────────────
export const fetchAllCafes      = (q = '')   => api.get(`/cafes${q ? `?q=${q}` : ''}`);
export const fetchRecommend     = (category) => api.get(`/recommend/${category}`);
export const fetchCafeDetail    = (id)       => api.get(`/cafes/${id}`);
export const fetchCustomRecommend = (data)   => api.post('/recommend/custom', data);

// ── Saved ──────────────────────────────
export const fetchSaved    = ()   => api.get('/saved');
export const checkSaved    = (id) => api.get(`/saved/check/${id}`);
export const saveToggle    = (id) => api.post(`/saved/${id}`);
export const fetchSavedCount = ()  => api.get('/saved/count');

// ── User Preferences (per kategori) ──────
export const fetchUserPref   = (category) => api.get(`/user-preferences/${category}`);
export const fetchAllUserPrefs = ()       => api.get('/user-preferences');
export const saveUserPref    = (category, data) => api.put(`/user-preferences/${category}`, data);

// ── Admin ────────────────────────────────
export const createCafe     = (data)           => api.post('/cafes', data);
export const updateCafe     = (id, data)       => api.put(`/cafes/${id}`, data);
export const deleteCafe     = (id)             => api.delete(`/cafes/${id}`);
export const fetchAllWeights = ()              => api.get('/weights');
export const updateWeights  = (category, data) => api.put(`/weights/${category}`, data);

// ── Upload ────────────────────────────────
export const uploadPhotos = (files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('photos', f));
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;
