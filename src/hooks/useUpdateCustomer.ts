import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService, UpdateCustomerPayload } from "@/services/customerService";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) => customerService.update(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer", variables.id],
      });
    },
  });
};
