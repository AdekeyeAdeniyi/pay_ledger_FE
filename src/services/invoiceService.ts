import { PaymentMethod } from "@/app/(dashboard)/invoices/[id]/page";
import api from "./api";

export interface LineItem {
  id?: string;
  amount?: number;
  invoiceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoicePayload {
  customerId: string;
  dueDate: string;
  notes?: string;
  lineItems: LineItem[];
}

export interface InvoiceForm {
  customerId: string;
  dueDate: string;
  notes: string;

  lineItems: LineItem[];
}

export interface InvoiceResponse {
  success: boolean;
  data: {
    id: string;
    invoiceNumber: string;
    totalAmount: string;
    status: string;
    createdAt: string;
  };
}

export type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "PARTIALLY_PAID" | "CANCELLED" | "EXPIRED";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  customerId: string;
  accountId: string;

  status: InvoiceStatus;

  totalAmount: string;
  amountPaid: string;
  balanceDue: string;

  currency: string;

  dueDate: string;
  notes?: string;

  checkoutLink?: string;
  orderReference?: string;

  createdAt: string;
  updatedAt: string;

  customer: {
    id: string;
    name: string;
    email: string;
  };

  lineItems?: LineItem[];
}

export interface InvoiceListResponse {
  success: boolean;
  data: Invoice[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface InvoiceQueryParams {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
  customerId?: string;
}

export const invoiceService = {
  create: async (payload: CreateInvoicePayload): Promise<InvoiceResponse> => {
    const { data } = await api.post("/invoices", payload);

    return data;
  },

  getInvoices: async (params?: InvoiceQueryParams): Promise<InvoiceListResponse> => {
    const { data } = await api.get("/invoices", {
      params,
    });

    return data;
  },

  getInvoice: async (id: string) => {
    const { data } = await api.get<{
      success: boolean;
      data: Invoice;
    }>(`/invoices/${id}`);

    return data.data;
  },

  updateInvoice: async (id: string, payload: CreateInvoicePayload) => {
    const { data } = await api.put(`/invoices/${id}`, payload);

    return data;
  },

  paymentOptions: async (id: string, allowedPaymentMethods: PaymentMethod[]) => {
    const { data } = await api.post(`/invoices/${id}/payment-options`, {
      allowedPaymentMethods,
    });
    return data;
  },

  cancelInvoice: async (id: string) => {
    const { data } = await api.patch(`/invoices/${id}/cancel`);

    return data;
  },

  downloadInvoicePDF: async (id: string) => {
    const { data } = await api.get(`/invoices/${id}/receipt`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));

    window.open(url, "_blank");

    setTimeout(() => window.URL.revokeObjectURL(url), 10_000);
  },
};
