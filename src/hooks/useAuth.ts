import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};
