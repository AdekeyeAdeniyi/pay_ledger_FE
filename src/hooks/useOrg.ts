import { useMutation, useQuery } from "@tanstack/react-query";
import { orgService } from "@/services/orgService";

export const useOrgProfile = () => {
  return useQuery({
    queryKey: ["org-profile"],
    queryFn: orgService.getProfile,
  });
};

export const useUpdateOrgProfile = () => {
  return useMutation({
    mutationFn: orgService.updateProfile,
  });
};
