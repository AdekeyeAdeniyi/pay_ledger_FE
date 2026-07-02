"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useCustomers } from "@/hooks/useCustomers";
import { useCreateInvoice } from "@/hooks/useCreateInvoice";
import { CreateInvoicePayload, Invoice, InvoiceForm, LineItem } from "@/services/invoiceService";
import { useUpdateInvoice } from "@/hooks/useInvoices";

interface CreateInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoiceDetails?: Invoice | null;
}

const EMPTY_LINE_ITEM: LineItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
};

export default function CreateInvoiceModal({ open, onClose, invoiceDetails }: CreateInvoiceModalProps) {
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();

  const { data: customers } = useCustomers();

  const [formError, setFormError] = useState<string | null>(null);

  const [invoice, setInvoice] = useState<InvoiceForm>({
    customerId: "",
    dueDate: "",
    notes: "",

    lineItems: [
      {
        ...EMPTY_LINE_ITEM,
      },
    ],
  });

  /**
   * Invoice Total
   */
  const invoiceTotal = useMemo(() => {
    return invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [invoice.lineItems]);

  /**
   * Reset Form
   */
  useEffect(() => {
    if (!open) return;

    if (invoiceDetails) {
      setInvoice({
        customerId: invoiceDetails.customerId,
        dueDate: invoiceDetails.dueDate.slice(0, 10),
        notes: invoiceDetails.notes ?? "",

        lineItems: invoiceDetails.lineItems?.length
          ? invoiceDetails.lineItems.map((item) => ({
              description: item.description,
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
            }))
          : [{ ...EMPTY_LINE_ITEM }],
      });
    } else {
      // Create mode

      setInvoice({
        customerId: "",
        dueDate: "",
        notes: "",

        lineItems: [
          {
            ...EMPTY_LINE_ITEM,
          },
        ],
      });
    }

    setFormError(null);
  }, [open, invoiceDetails]);

  /**
   * ----------------------------
   * LINE ITEMS
   * ----------------------------
   */

  const addLineItem = () => {
    setInvoice((prev) => ({
      ...prev,

      lineItems: [
        ...prev.lineItems,
        {
          ...EMPTY_LINE_ITEM,
        },
      ],
    }));
  };

  const removeLineItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,

      lineItems: prev.lineItems.length === 1 ? prev.lineItems : prev.lineItems.filter((_, i) => i !== index),
    }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    setInvoice((prev) => {
      const items = [...prev.lineItems];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,
        lineItems: items,
      };
    });
  };

  const handleSubmit = () => {
    setFormError(null);

    if (!invoice.customerId) {
      setFormError("Please select a customer.");
      return;
    }

    if (!invoice.dueDate) {
      setFormError("Please select a due date.");
      return;
    }

    if (invoice.lineItems.length === 0) {
      setFormError("Add at least one line item.");
      return;
    }

    for (const item of invoice.lineItems) {
      if (!item.description.trim()) {
        setFormError("Every line item requires a description.");
        return;
      }

      if (item.quantity <= 0) {
        setFormError("Quantity must be greater than zero.");
        return;
      }

      if (item.unitPrice < 0) {
        setFormError("Unit price cannot be negative.");
        return;
      }
    }

    const payload: CreateInvoicePayload = {
      customerId: invoice.customerId,
      dueDate: invoice.dueDate,
      notes: invoice.notes,
      lineItems: invoice.lineItems,
    };

    if (invoiceDetails?.customerId) {
      updateInvoice.mutate(
        {
          id: invoiceDetails.id,
          payload,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createInvoice.mutate(payload, {
        onSuccess: () => {
          setInvoice({
            customerId: "",
            dueDate: "",
            notes: "",
            lineItems: [
              {
                description: "",
                quantity: 1,
                unitPrice: 0,
              },
            ],
          });

          onClose();
          setFormError(null);
        },

        onError: (error: any) => {
          setFormError(error?.response?.data?.message ?? "Unable to create invoice.");
        },
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}

      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}

      <div className="relative bg-white rounded-xl shadow-2xl border border-pl-border-dark w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-pl-border-dark">
          <div>
            <h2 className="text-xl font-bold">{invoiceDetails?.customerId ? "Edit" : "Generate"} Invoice</h2>

            <p className="text-sm text-pl-ink-3 mt-1">{invoiceDetails?.customerId ? "Edit" : "Generate"} a customer invoice</p>
          </div>

          <button onClick={onClose} className="rounded-lg p-2 hover:bg-pl-surface transition">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {formError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{formError}</div>}

            {/* Customer & Due Date */}

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Customer */}

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-pl-ink-2">Customer</label>

                <select
                  value={invoice.customerId}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      customerId: e.target.value,
                    }))
                  }
                  className="w-full h-11 rounded-pl-sm border border-pl-border-dark bg-white px-3 text-sm outline-none focus:border-pl-primary focus:ring-2 focus:ring-pl-primary/10">
                  <option value="">Select Customer</option>

                  {customers?.data?.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-pl-ink-2">Due Date</label>

                <Input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Notes */}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-pl-ink-2">Notes</label>

              <textarea
                rows={4}
                value={invoice.notes}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Additional notes for the customer..."
                className="
          w-full
          rounded-pl-sm
          border
          border-pl-border-dark
          bg-white
          px-4
          py-3
          text-sm
          outline-none
          resize-none
          focus:border-pl-primary
          focus:ring-2
          focus:ring-pl-primary/10
        "
              />
            </div>

            {/* Divider */}

            <div className="border-t border-pl-border-dark" />

            {/* Line Items Section */}

            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-pl-ink">Invoice Line Items</h3>

                  <p className="text-xs text-pl-ink-3 mt-1">Add one or more billable items.</p>
                </div>

                <Button type="button" variant="ghost" size="sm" onClick={addLineItem}>
                  <Plus size={15} />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {invoice.lineItems.map((item, index) => {
                  const rowTotal = item.quantity * item.unitPrice;

                  return (
                    <div key={index} className="rounded-xl border border-pl-border-dark bg-pl-surface/30 p-5">
                      {/* Header */}

                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h4 className="font-semibold text-pl-ink">Item {index + 1}</h4>

                          <p className="text-xs text-pl-ink-3">Invoice line item</p>
                        </div>

                        {invoice.lineItems.length > 1 && (
                          <button type="button" onClick={() => removeLineItem(index)} className="w-9 h-9 rounded-lg hover:bg-red-50 flex items-center justify-center transition">
                            <Trash2 size={17} className="text-pl-red" />
                          </button>
                        )}
                      </div>

                      {/* Description */}

                      <Input label="Description" placeholder="Website Development" value={item.description} onChange={(e) => updateLineItem(index, "description", e.target.value)} />

                      {/* Qty + Unit Price */}

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <Input label="Quantity" type="number" min={1} value={item.quantity} onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))} />

                        <Input label="Unit Price (₦)" type="number" min={0} value={item.unitPrice} onChange={(e) => updateLineItem(index, "unitPrice", Number(e.target.value))} />
                      </div>

                      {/* Row Total */}

                      <div className="mt-5 rounded-lg bg-white border border-pl-border-dark px-4 py-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-pl-ink-3">Line Total</span>

                        <span className="text-lg font-bold text-pl-primary">₦{rowTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Invoice Total */}

              <div className="mt-6 rounded-xl bg-pl-primary text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80">Grand Total</p>

                    <h2 className="text-4xl font-black mt-2">₦{invoiceTotal.toLocaleString()}</h2>
                  </div>

                  <div className="text-right">
                    <p className="text-sm">
                      {invoice.lineItems.length} {invoice.lineItems.length === 1 ? "Line Item" : "Line Items"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}

              <div className="border-t border-pl-border-dark mt-8 pt-6 flex flex-col sm:flex-row justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>

                {invoiceDetails?.customerId ? (
                  <Button type="button" variant="primary" onClick={handleSubmit}>
                    {createInvoice.isPending ? "Updating..." : "Edit Invoice"}
                  </Button>
                ) : (
                  <Button type="button" variant="primary" onClick={handleSubmit} disabled={createInvoice.isPending}>
                    {createInvoice.isPending ? "Generating..." : "Generate Invoice"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
