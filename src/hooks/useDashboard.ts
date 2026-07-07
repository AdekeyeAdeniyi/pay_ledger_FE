import { dashboardService } from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => dashboardService.getOverview(),
    refetchInterval: 30000,
    staleTime: 5000,
  });
};
