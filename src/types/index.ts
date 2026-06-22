export interface AppUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
}

export interface DashboardCard {
  title: string;
  value: number | string;
  description?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export const PLAN_LIMITS: Record<string, { posts: number; accounts: number; aiCredits: number; members: number }> = {
  FREE: { posts: 10, accounts: 1, aiCredits: 20, members: 1 },
  STARTER: { posts: 100, accounts: 3, aiCredits: 200, members: 3 },
  PRO: { posts: -1, accounts: 10, aiCredits: 1000, members: 10 },
  ENTERPRISE: { posts: -1, accounts: -1, aiCredits: -1, members: -1 },
};

export const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  STARTER: 149000,
  PRO: 349000,
  ENTERPRISE: 0,
};
