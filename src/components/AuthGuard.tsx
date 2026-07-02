"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const authRoutes = ["/login", "/register"];
    const isAuthPage = authRoutes.includes(pathname);

    if (!token && !isAuthPage) {
      router.push("/login");
    } else if (token && isAuthPage) {
      router.push("/dashboard");
    } else {
    }
  }, [pathname, router]);

  return <>{children}</>;
};
