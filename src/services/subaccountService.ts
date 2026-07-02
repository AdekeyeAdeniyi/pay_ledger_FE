import api from "./api";

export interface Subaccount {
  id: string;
  label: string;
  description: string;
  nombaAccountId: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
}

interface SubaccountResponse {
  success: boolean;
  data: Subaccount[];
}

export const subaccountService = {
  getAll: async (): Promise<SubaccountResponse> => {
    const { data } = await api.get("/subaccounts");
    return data;
  },
};
