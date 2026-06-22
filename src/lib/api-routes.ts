export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  ai: {
    ideas: '/api/ai',
  },
  posts: {
    list: '/api/posts',
  },
  media: {
    list: '/api/media',
  },
  analytics: {
    overview: '/api/analytics',
  },
  billing: {
    invoices: '/api/billing',
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;
