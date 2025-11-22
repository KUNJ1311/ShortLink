import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance with default config
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required to send/receive cookies (user_id)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || "An unexpected error occurred";
    const errorCode = error.response?.data?.errorCode;
    const customError = new Error(message) as Error & { errorCode?: string };
    customError.errorCode = errorCode;
    return Promise.reject(customError);
  }
);

export interface Link {
  id: number;
  code: string;
  original_url: string;
  short_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

export interface LinkStats extends Link {
  analytics: {
    devices: Record<string, number>;
  };
}

export interface CreateLinkResponse {
  code: string;
  original_url: string;
  short_url: string;
}

export interface ListLinksResponse {
  data: Link[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface HealthCheckResponse {
  ok: boolean;
  version: string;
  uptime: number;
  timestamp: string;
  services: {
    database: string;
    server: string;
  };
  metrics?: {
    dbResponseTime: string;
    totalResponseTime: string;
  };
}

// Health Check
export const checkHealth = async () => {
  const response = await client.get<HealthCheckResponse>("/healthz");
  return response.data;
};

// Create Link
export const createLink = async (original_url: string, custom_code?: string) => {
  const response = await client.post<CreateLinkResponse>("/api/links", {
    original_url,
    custom_code,
  });
  return response.data;
};

// List Links
export const listLinks = async (
  page = 1,
  limit = 10,
  search = "",
  sortBy?: "clicks" | "created_at" | "last_clicked_at",
  sortOrder?: "asc" | "desc"
) => {
  const params: Record<string, string | number> = {
    page,
    limit,
    search,
  };

  if (sortBy) {
    params.sortBy = sortBy;
  }
  if (sortOrder) {
    params.sortOrder = sortOrder;
  }

  const response = await client.get<ListLinksResponse>("/api/links", { params });
  return response.data;
};

// Get Link Statistics
export const getLinkStats = async (code: string) => {
  const response = await client.get<LinkStats>(`/api/links/${code}`);
  return response.data;
};

// Update Link URL
export const updateLink = async (code: string, original_url: string) => {
  const response = await client.patch<{ message: string; code: string; original_url: string }>(
    `/api/links/${code}`,
    { original_url }
  );
  return response.data;
};

// Delete Link
export const deleteLink = async (code: string) => {
  const response = await client.delete<{ message: string }>(`/api/links/${code}`);
  return response.data;
};
