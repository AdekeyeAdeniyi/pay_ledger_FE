import api from "./api";

export interface OrgProfile {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  whatsappNumber: string | null;
  notifyOnPayment: boolean;
  notifyDailySummary: boolean;
  notifyWeeklySummary: boolean;
  createdAt: string;
  webhook?: string;
}

interface OrgProfileResponse {
  success: boolean;
  data: OrgProfile;
}

export const orgService = {
  getProfile: async (): Promise<OrgProfileResponse> => {
    const { data } = await api.get("/org/profile");
    return data;
  },

  updateProfile: async (payload: Partial<OrgProfile>): Promise<OrgProfileResponse> => {
    const { data } = await api.put("/org/profile", payload);
    return data;
  },
};
