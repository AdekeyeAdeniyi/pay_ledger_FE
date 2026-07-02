"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFields } from "@/types/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";
import { setAuthToken } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmitForm = async (data: LoginFields) => {
    setGlobalError(null);
    try {
      loginMutation.mutate(data, {
        onSuccess: (response) => {
          if (response.success) {
            setAuthToken(response.data.access_token);
            router.push("/dashboard");
          }
        },
      });
    } catch {
      setGlobalError("Failed to initialize secure workspace.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-pl-ink tracking-tight mb-2">Access Platform Shell</h1>
        <p className="text-xs text-pl-ink-2">Provide your management credentials node to access your dedicated accounting records.</p>
      </div>

      {globalError && <div className="p-3 bg-pl-red-light border border-pl-red/20 rounded-pl-sm text-xs text-pl-red font-medium mb-5">{globalError}</div>}

      <form
        onSubmit={handleSubmit((data, e) => {
          e?.preventDefault();
          onSubmitForm(data);
        })}
        className="space-y-4">
        <Input label="Infrastructure Admin Email" type="email" placeholder="musa@enterprises.com" error={errors.email?.message} disabled={isSubmitting} {...register("email")} />

        <Input label="Security Access Key" type="password" placeholder="••••••••" error={errors.password?.message} disabled={isSubmitting} {...register("password")} />

        <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
          Authenticate Identity
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-pl-border-dark text-center">
        <p className="text-xs text-pl-ink-2">
          New to the Platform?{" "}
          <Link href="/register" className="font-bold text-pl-primary hover:underline">
            Provision New Organization
          </Link>
        </p>
      </div>
    </div>
  );
}
