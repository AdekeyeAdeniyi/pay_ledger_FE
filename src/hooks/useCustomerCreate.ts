import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";

export const useCustomerCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};
