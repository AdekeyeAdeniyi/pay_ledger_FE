import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";

export const useCustomers = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["customers", page, limit],
    queryFn: () =>
      customerService.getCustomers({
        page,
        limit,
        status: "ACTIVE",
      }),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
  });
};
