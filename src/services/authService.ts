import api from "./api";

interface RegisterPayload {
  businessName: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterData {
  org: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  access_token: string;
  refresh_token: string;
  webhookSecret: string;
}

interface RegisterResponse {
  success: boolean;
  data: RegisterData;
}

export const setAuthToken = (token: string | null, type: "access" | "refresh" = "access") => {
  if (token) {
    localStorage.setItem(`${type}_token`, token);
    if (type === "access") {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  } else {
    localStorage.removeItem(`${type}_token`);
    if (type === "access") {
      delete api.defaults.headers.common["Authorization"];
    }
  }
};

export const authService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);

    return data;
  },

  login: async (payload: LoginPayload): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/login", payload);
    return data;
  },
};
