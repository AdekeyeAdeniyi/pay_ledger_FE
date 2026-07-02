import api from "./api";

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  customerType: "RECURRING" | "ONE_TIME";
  notes?: string;
}

export interface UpdateCustomerPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface VirtualAccount {
  accountNumber: string;
  bankName: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  customerCode: string;
  customerType: "RECURRING" | "ONE_TIME";
  status: "ACTIVE" | "PENDING_VA" | "INACTIVE";
  creditBalance: string;
  outstandingDebt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  virtualAccount: VirtualAccount | null;
}

export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
}

export interface GetCustomersParams {
  status?: "ACTIVE" | "PENDING_VA" | "INACTIVE";
  page?: number;
  limit?: number;
}

export const customerService = {
  create: async (payload: CreateCustomerPayload) => {
    const { data } = await api.post("/customers", payload);
    return data;
  },

  getCustomers: async ({ page = 1, limit = 20, status = "ACTIVE" }: GetCustomersParams = {}): Promise<CustomersResponse> => {
    const { data } = await api.get("/customers", {
      params: {
        page,
        limit,
        status,
      },
    });

    return data;
  },

  getCustomer: async (id: string): Promise<CustomerResponse> => {
    const { data } = await api.get(`/customers/${id}`);
    return data;
  },

  update: async ({ id, ...payload }: UpdateCustomerPayload) => {
    const { data } = await api.put(`/customers/${id}`, payload);
    return data;
  },

  deactivate: async (id: string) => {
    const { data } = await api.post(`/customers/${id}/deactivate`);
    return data;
  },

  reactivate: async (id: string) => {
    const { data } = await api.post(`/customers/${id}/reactivate`);
    return data;
  },
};
