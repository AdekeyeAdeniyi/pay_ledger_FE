import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
};
