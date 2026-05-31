import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export const getPaymentInfo = () => api.get('/submissions/payment-info');
export const submitForm = (formData) =>
  api.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const adminLogin = (credentials) => api.post('/auth/login', credentials);
export const getAdminMe = () => api.get('/auth/me');
export const getSubmissions = (params) => api.get('/submissions', { params });
export const getSubmission = (id) => api.get(`/submissions/${id}`);
export const updateSubmissionStatus = (id, reviewStatus) =>
  api.patch(`/submissions/${id}/status`, { reviewStatus });
export const getDomains = () => api.get('/submissions/domains');
export const getStats = () => api.get('/submissions/stats');

export const fileUrl = (file) => {
  if (!file?.filename) return null;
  let subpath = 'misc';
  if (file.path?.includes('resumes')) subpath = 'resumes';
  else if (file.path?.includes('payments')) subpath = 'payments';
  else if (file.path?.includes('screenshots')) subpath = 'screenshots';
  return `${baseURL}/uploads/${subpath}/${file.filename}`;
};

export default api;
