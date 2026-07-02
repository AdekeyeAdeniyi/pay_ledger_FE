"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterFields } from "@/types/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const registerMutation = useRegister();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    const isStepValid = await trigger(step === 1 ? ["businessName", "email"] : undefined);
    if (isStepValid) setStep((s) => s + 1);
  };

  const onProvisionSubmit = async (data: RegisterFields) => {
    setGlobalError(null);
    try {
      registerMutation.mutate(data, {
        onSuccess: (response) => {
          if (response.success) {
            // Now you can safely navigate
            localStorage.setItem("access_token", response.data.access_token);
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
        <h1 className="text-xl font-bold text-pl-ink tracking-tight mb-2">{step === 1 ? "Corporate Identity" : "Secure Authentication"}</h1>
        <p className="text-xs text-pl-ink-2">{step === 1 ? "Enter your business details to start the isolation process." : "Define your password to protect your ledger instance."}</p>
      </div>

      {globalError && <div className="p-3 bg-pl-red-light border border-pl-red/20 rounded-pl-sm text-xs text-pl-red font-medium mb-5">{globalError}</div>}

      <form onSubmit={handleSubmit(onProvisionSubmit)} className="space-y-4">
        {step === 1 ? (
          <>
            <Input label="Corporate Identity Name" placeholder="e.g., Musa Enterprises" error={errors.businessName?.message} {...register("businessName")} />
            <Input label="Primary Admin Email" type="email" placeholder="control@musa.com" error={errors.email?.message} {...register("email")} />
            <Input label="Phone Number" placeholder="0909773287823" error={errors.phone?.message} {...register("phone")} />
            <Button type="button" variant="primary" className="w-full mt-2" onClick={nextStep} icon={<ChevronRight size={16} />}>
              Continue to Security
            </Button>
          </>
        ) : (
          <>
            <Input label="Account Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="w-1/3" onClick={() => setStep(1)} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                Deploy Instance
              </Button>
            </div>
          </>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-pl-border-dark text-center">
        <p className="text-xs text-pl-ink-2">
          Already running an instance?{" "}
          <Link href="/login" className="font-bold text-pl-primary hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
