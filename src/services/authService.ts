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
  webhookSecret: string;
}

interface RegisterResponse {
  success: boolean;
  data: RegisterData;
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("access_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common["Authorization"];
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
