import { transactionService } from "@/services/transactionService";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = (page = 1) => {
  return useQuery({
    queryKey: ["transactions", page],
    queryFn: () => transactionService.getTransactions(page),
  });
};
