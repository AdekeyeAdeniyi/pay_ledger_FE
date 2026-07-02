import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";

export const useReactivateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.reactivate,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer", id],
      });
    },
  });
};
