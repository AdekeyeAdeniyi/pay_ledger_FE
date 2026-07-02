import { useQuery } from "@tanstack/react-query";
import { subaccountService } from "@/services/subaccountService";

export const useSubaccounts = () => {
  return useQuery({
    queryKey: ["subaccounts"],
    queryFn: subaccountService.getAll,
  });
};
