// API Endpoints configuration
// const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    REFRESH_TOKEN: `/auth/refresh`,
    LOGOUT: `/auth/logout`,
  },

  // User endpoints
  USER: {
    PROFILE: `/user/profile`,
    UPDATE_PROFILE: `/user/profile`,
    CHANGE_PASSWORD: `/user/change-password`,
  },

  // Navigation endpoints
  NAVIGATION: {
    MENU_ITEMS: `/navigation/menu`,
    FOOTER_LINKS: `/navigation/footer`,
  },

  // Cart endpoints
  CART: {
    COUNT: `/cart/count`,
    ITEMS: `/cart/items`,
    ADD: `/cart/add`,
    REMOVE: `/cart/remove`,
  },

  // Content endpoints
  CONTENT: {
    SOCIAL_LINKS: `/content/social-links`,
    CONTACT_INFO: `/content/contact`,
    NEWSLETTER: `/content/newsletter/subscribe`,
  },
} as const;
