import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateInvoicePayload, InvoiceQueryParams, invoiceService } from "@/services/invoiceService";
import { PaymentMethod } from "@/app/(dashboard)/invoices/[id]/page";

export const useInvoices = (params: InvoiceQueryParams) => {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => invoiceService.getInvoices(params),
  });
};

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getInvoice(id),
    enabled: !!id,
  });
}

export function useCancelInvoice() {
  return useMutation({
    mutationFn: (id: string) => invoiceService.cancelInvoice(id),
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateInvoicePayload }) => invoiceService.updateInvoice(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoice", variables.id],
      });
    },
  });
}

export const useInvoicePaymentOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, allowedPaymentMethods }: { id: string; allowedPaymentMethods: PaymentMethod[] }) => invoiceService.paymentOptions(id, allowedPaymentMethods),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoice", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
};

export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: (id: string) => invoiceService.downloadInvoicePDF(id),
  });
};
