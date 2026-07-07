import { useQuery } from "@tanstack/react-query";
import api from "./api";

export const transactionService = {
  getTransactions: async (page = 1) => {
    const { data } = await api.get(`/transactions?page=${page}`);
    return data.data;
  },
};

export const useTransactions = (page = 1) => {
  return useQuery({
    queryKey: ["transactions", page],
    queryFn: () => transactionService.getTransactions(page),
  });
};
