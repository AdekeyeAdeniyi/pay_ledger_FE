"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  customerType: "RECURRING" | "ONE_TIME";
  notes: string;
}

interface CustomerFormModalProps {
  open: boolean;
  mode?: "create" | "edit";
  loading?: boolean;
  error?: string | null;
  initialValues: CustomerFormData;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
}

export default function CustomerFormModal({ open, mode = "create", loading = false, error, initialValues, onClose, onSubmit }: CustomerFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: initialValues,
  });

  // 2. Keep form sync'd when initialValues or open state changes
  useEffect(() => {
    if (open) {
      reset(initialValues);
    }
  }, [initialValues, open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-pl-ink/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-pl-lg border border-pl-border-dark p-6 max-w-md w-full shadow-lg">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-pl-ink">{mode === "create" ? "Provision Client Router" : "Edit Customer"}</h3>
          <p className="text-xs text-pl-ink-3 mt-1">{mode === "create" ? "Register a customer and provision a virtual account." : "Update customer information."}</p>
        </div>

        {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Company Name"
              placeholder="e.g., Dangote Logistics Outlets"
              {...register("name", {
                required: "Company name is required",
                pattern: {
                  value: /^[a-zA-Z0-9\s.-]+$/,
                  message: "Special characters (like @, #, $, /, !) are not allowed",
                },
              })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              placeholder="e.g., invoices@dangotegroup.com"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Input label="Phone" placeholder="e.g., 0803 000 1111" {...register("phone", { required: "Phone number is required" })} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          {mode === "create" && (
            <div>
              <label className="block text-xs font-medium mb-2">Customer Type</label>
              <select {...register("customerType")} className="w-full h-10 rounded-pl-sm border border-pl-border-dark px-3 bg-white text-sm">
                <option value="RECURRING">Recurring</option>
                <option value="ONE_TIME">One Time</option>
              </select>
            </div>
          )}

          <div>
            <Input label="Notes" placeholder="Internal notes..." {...register("notes")} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (mode === "create" ? "Creating..." : "Saving...") : mode === "create" ? "Create Customer" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
