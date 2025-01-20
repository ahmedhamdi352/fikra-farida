import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.your-domain.com';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Header related APIs
export const headerApi = {
  getNavigationItems: () => api.get('/navigation'),
  getCartCount: () => api.get('/cart/count'),
  getUserProfile: () => api.get('/user/profile'),
};

// Footer related APIs
export const footerApi = {
  getSocialLinks: () => api.get('/social-links'),
  getContactInfo: () => api.get('/contact-info'),
  subscribeNewsletter: (email: string) => api.post('/newsletter/subscribe', { email }),
};
