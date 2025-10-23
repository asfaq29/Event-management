import axios, { type AxiosResponse } from "axios";

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  organizer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EventFormData {
  title: string;
  description?: string;
  date: string;
  location: string;
  organizer: string;
}

interface EventsResponse {
  items: Event[];
  total?: number;
  page?: number;
  limit?: number;
}

interface EventsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<LoginResponse>> =>
    api.post("/auth/login", credentials),
  register: (
    credentials: RegisterCredentials
  ): Promise<AxiosResponse<RegisterResponse>> =>
    api.post("/auth/register", credentials),
};

// Events API
export const eventsAPI = {
  getEvents: (params?: EventsParams): Promise<AxiosResponse<EventsResponse>> =>
    api.get("/events", { params }),
  createEvent: (eventData: EventFormData): Promise<AxiosResponse<Event>> =>
    api.post("/events", eventData),
  updateEvent: (
    id: string,
    eventData: EventFormData
  ): Promise<AxiosResponse<Event>> => api.patch(`/events/${id}`, eventData),
  deleteEvent: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/events/${id}`),
};

export default api;
export type {
  Event,
  EventFormData,
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  EventsResponse,
  EventsParams,
};
