"use client";

import { useEffect, useState } from "react";
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
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-pl-ink/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-pl-lg border border-pl-border-dark p-6 max-w-md w-full shadow-lg">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-pl-ink">{mode === "create" ? "Provision Client Router" : "Edit Customer"}</h3>

          <p className="text-xs text-pl-ink-3 mt-1">{mode === "create" ? "Register a customer and provision a virtual account." : "Update customer information."}</p>
        </div>

        {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            value={formData.name}
            placeholder="e.g., Dangote Logistics Outlets"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <Input
            label="Email"
            type="email"
            placeholder="e.g., invoices@dangotegroup.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />

          <Input
            label="Phone"
            placeholder="e.g., 0803 000 1111"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />

          {mode === "create" && (
            <div>
              <label className="block text-xs font-medium mb-2">Customer Type</label>

              <select
                value={formData.customerType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerType: e.target.value as "RECURRING" | "ONE_TIME",
                  }))
                }
                className="w-full h-10 rounded-pl-sm border border-pl-border-dark px-3">
                <option value="RECURRING">Recurring</option>

                <option value="ONE_TIME">One Time</option>
              </select>
            </div>
          )}

          <Input
            label="Notes"
            placeholder="Internal notes..."
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
          />

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
