"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { ArrowLeft, Pencil, Trash2, CreditCard, Calendar, Copy, ExternalLink, FileDown, Wallet } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/formatDate";
import { formatCurrency } from "@/lib/formatCurrency";
import { useCancelInvoice, useDownloadInvoice, useInvoice, useInvoicePaymentOptions } from "@/hooks/useInvoices";
import { useState } from "react";
import CreateInvoiceModal from "@/components/modal/CreateEditInvoiceModal";
import { BadgeStatusType, StatusBadge } from "@/components/ui/StatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import PreLoader from "@/components/modal/Preloader";

export const PAYMENT_METHODS = ["Card", "Transfer", "Nomba QR", "USSD"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const invoiceId = params.id as string;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>(["Card", "Transfer"]);

  const { data, isLoading, isError, refetch } = useInvoice(invoiceId);
  const { mutate: viewReciept, isPending } = useDownloadInvoice();
  const cancelInvoice = useCancelInvoice();
  const generateCheckout = useInvoicePaymentOptions();

  if (isLoading) {
    return <PreLoader />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-pl-lg border border-pl-border-dark bg-white p-10 text-center">
        <h2 className="text-xl font-bold text-pl-ink">Unable to load invoice</h2>

        <p className="mt-2 text-sm text-pl-ink-3">Something went wrong while retrieving this invoice.</p>

        <Button className="mt-6" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const invoice = data;

  const total = Number(invoice.totalAmount);
  const paid = Number(invoice.amountPaid);

  const balanceDue = Math.max(total - paid, 0);
  const overpayment = Math.max(paid - total, 0);

  const toggleMethod = (method: PaymentMethod) => {
    setSelectedMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]));
  };

  return (
    <div className="space-y-6">
      {/* ===================================================== */}
      {/* Header */}
      {/* ===================================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/invoices" className="inline-flex items-center gap-2 text-sm text-pl-ink-3 hover:text-pl-primary transition">
            <ArrowLeft size={16} />
            Back to invoices
          </Link>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-pl-ink">{invoice.invoiceNumber}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge label={invoice.status.replaceAll("_", " ")} status={invoice.status.toLowerCase() as BadgeStatusType} />

            <span className="text-sm text-pl-ink-3">Created {formatDate(invoice.createdAt)}</span>

            <span className="text-sm text-pl-ink-3">Due {formatDate(invoice.dueDate)}</span>
          </div>
        </div>

        {invoice.status === "PENDING" && (
          <div className="flex flex-wrap gap-3">
            {!invoice.checkoutLink && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(true)}>
                <Pencil size={16} />
                Edit
              </Button>
            )}

            {invoice.checkoutLink && (
              <Button variant="primary" size="sm" onClick={() => window.open(invoice.checkoutLink!, "_blank")}>
                <ExternalLink size={16} />
                Checkout
              </Button>
            )}
            {!invoice.checkoutLink && (
              <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={16} />
                Cancel
              </Button>
            )}
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => viewReciept(invoiceId)} isLoading={isPending} disabled={isPending}>
          <FileDown size={16} />
          {isPending ? "Preparing…" : "View receipt"}
        </Button>
      </div>
      {/* ===================================================== */}
      {/* Summary Cards */}
      {/* ===================================================== */}
      <div className="flex flex-col lg:flex-row justify-between gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-pl-ink-3">Total Amount</p>

              <h2 className="mt-2 text-lg font-black text-pl-ink">{formatCurrency(invoice.totalAmount)}</h2>
            </div>

            <CreditCard size={26} className="text-pl-primary" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-pl-ink-3">Amount Paid</p>

              <h2 className="mt-2 text-lg font-black text-green-600">{formatCurrency(invoice.amountPaid)}</h2>
            </div>

            <CreditCard size={26} className="text-green-600" />
          </div>
        </Card>

        {overpayment > 0 ? (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-pl-ink-3">Overpayment</p>

                <h2 className={"mt-2 text-lg font-black text-pl-emerald-dark"}>{formatCurrency(overpayment)}</h2>
              </div>

              <Wallet size={26} className="text-pl-emerald-dark" />
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-pl-ink-3">Balance Due</p>

                <h2 className={cn("mt-2 text-lg font-black ", balanceDue > 0 ? "text-pl-red" : "text-pl-emerald-dark")}>{formatCurrency(balanceDue)}</h2>
              </div>

              <Calendar size={26} className={cn(balanceDue > 0 ? "text-pl-red" : "text-pl-emerald-dark")} />
            </div>
          </Card>
        )}
      </div>
      {/* ===================================================== */}
      {/* Customer & Payment Information */}
      {/* ===================================================== */}
      <div className="flex gap-6 flex-col lg:flex-row">
        <Card className="rounded-pl-lg border border-pl-border-dark">
          <div className="border-b border-pl-border-dark p-5">
            <h2 className="text-lg font-bold text-pl-ink">Customer Information</h2>

            <p className="mt-1 text-sm text-pl-ink-3">Customer details attached to this invoice.</p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs uppercase text-pl-ink-3">Customer Name</p>

              <p className="mt-1 font-semibold text-pl-ink">{invoice.customer.name}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-pl-ink-3">Email Address</p>

              <p className="mt-1 text-pl-ink">{invoice.customer.email || "--"}</p>
            </div>

            {/* <div>
              <p className="text-xs uppercase text-pl-ink-3">Phone Number</p>

              <p className="mt-1 text-pl-ink">{invoice.customer. || "--"}</p>
            </div> */}

            {/* <div>
              <p className="text-xs uppercase text-pl-ink-3">Customer Code</p>

              <p className="mt-1 font-mono text-pl-primary">{invoice.customer.customerCode}</p>
            </div> */}

            {/* <div>
              <p className="text-xs uppercase text-pl-ink-3">Customer Type</p>

              <StatusBadge status="paid" label={invoice.customer.customerType.replace("_", " ")} />
            </div> */}
          </div>
        </Card>

        {/* Payment Information */}

        <Card className="rounded-pl-lg border border-pl-border-dark">
          <div className="border-b border-pl-border-dark p-5">
            <h2 className="text-lg font-bold text-pl-ink">Payment Information</h2>

            <p className="mt-1 text-sm text-pl-ink-3">Checkout and payment metadata.</p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs uppercase text-pl-ink-3">Invoice Number</p>

              <p className="mt-1 font-mono text-pl-ink">{invoice.invoiceNumber}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-pl-ink-3">Order Reference</p>

              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-pl-ink">{invoice.orderReference || "--"}</span>

                {invoice.orderReference && (
                  <button onClick={() => navigator.clipboard.writeText(invoice.orderReference!)} className="rounded p-1 hover:bg-pl-surface">
                    <Copy size={15} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase text-pl-ink-3">Due Date</p>

              <p className="mt-1 text-pl-ink">{formatDate(invoice.dueDate)}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-pl-ink-3">Currency</p>

              <p className="mt-1 text-pl-ink">{invoice.currency}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-pl-ink-3">Created</p>

              <p className="mt-1 text-pl-ink">{formatDate(invoice.createdAt)}</p>
            </div>
          </div>
        </Card>
      </div>
      {/* ===================================================== */}
      {/* Checkout Information */}
      {/* ===================================================== */}
      {invoice.status === "PENDING" && invoice.accountId && (
        <Card className="rounded-pl-lg border border-pl-border-dark">
          <div className="border-b border-pl-border-dark p-5">
            <h2 className="text-lg font-bold text-pl-ink">Checkout Information</h2>

            <p className="mt-1 text-sm text-pl-ink-3">Customer payment link generated through Nomba Checkout.</p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs uppercase text-pl-ink-3">Checkout Link</p>

              {invoice.checkoutLink ? (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <input readOnly value={invoice.checkoutLink} className="flex-1 rounded-pl-sm border border-pl-border-dark bg-pl-surface px-3 py-2 text-sm" />

                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(invoice.checkoutLink!)}>
                    <Copy size={15} />
                    Copy
                  </Button>

                  <Button variant="primary" size="sm" onClick={() => window.open(invoice.checkoutLink!, "_blank")}>
                    <ExternalLink size={15} />
                    Open
                  </Button>
                </div>
              ) : (
                <div className="rounded-pl-md border border-dashed border-pl-border-dark bg-pl-surface p-6 text-center">
                  <p className="text-sm text-pl-ink-3">Checkout has not been generated.</p>

                  <Button className="mt-4" size="sm" onClick={() => setPaymentModalOpen(true)}>
                    Generate Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
      {/* ===================================================== */}
      {/* Invoice Line Items */}
      {/* ===================================================== */}
      <Card className="rounded-pl-lg border border-pl-border-dark overflow-hidden">
        <div className="border-b border-pl-border-dark p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-pl-ink">Invoice Items</h2>

              <p className="mt-1 text-sm text-pl-ink-3">Products and services billed to the customer.</p>
            </div>

            <div className="rounded-full bg-pl-surface px-4 py-2 text-xs font-semibold">
              {invoice.lineItems?.length} Item{invoice.lineItems && invoice.lineItems?.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pl-surface border-b border-pl-border-dark text-xs uppercase text-pl-ink-3">
              <tr>
                <th className="px-6 py-4 text-left">Description</th>

                <th className="px-6 py-4 text-center">Qty</th>

                <th className="px-6 py-4 text-right">Unit Price</th>

                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {invoice.lineItems &&
                invoice.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-pl-border-dark hover:bg-pl-surface/30">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-pl-ink">{item.description}</div>
                    </td>

                    <td className="px-6 py-5 text-center font-medium">{item.quantity}</td>

                    <td className="px-6 py-5 text-right">{formatCurrency(item.unitPrice)}</td>

                    <td className="px-6 py-5 text-right font-bold text-pl-ink">{formatCurrency(item.amount || 0)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}

        <div className="border-t border-pl-border-dark bg-pl-surface/30 p-6">
          <div className="ml-auto max-w-sm space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-pl-ink-3">Subtotal</span>

              <span className="font-semibold">{formatCurrency(invoice.totalAmount)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-pl-ink-3">Amount Paid</span>

              <span className="font-semibold text-green-600">{formatCurrency(invoice.amountPaid)}</span>
            </div>

            {overpayment > 0 ? (
              <div className="flex justify-between text-sm">
                <span className="text-pl-ink-3">Customer Credit</span>

                <span className="font-semibold text-green-600">{formatCurrency(overpayment)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-pl-ink-3">Balance Due</span>

                <span className={`font-semibold ${balanceDue > 0 ? "text-pl-red" : "text-green-600"}`}>{formatCurrency(balanceDue)}</span>
              </div>
            )}

            <div className="border-t border-pl-border-dark pt-4 flex justify-between">
              <span className="text-base font-bold">Invoice Total</span>

              <span className="text-2xl font-black text-pl-primary">{formatCurrency(invoice.totalAmount)}</span>
            </div>

            {overpayment > 0 && (
              <p className="mt-4 text-xs text-green-700 font-bold">
                This invoice has been fully settled. The excess payment of <span className="font-semibold">{formatCurrency(overpayment)}</span> has been recorded as customer credit.
              </p>
            )}
          </div>
        </div>
      </Card>
      {/* ===================================================== */}
      {/* Notes */}
      {/* ===================================================== */}
      <Card className="rounded-pl-lg border border-pl-border-dark">
        <div className="border-b border-pl-border-dark p-5">
          <h2 className="text-lg font-bold text-pl-ink">Internal Notes</h2>

          <p className="mt-1 text-sm text-pl-ink-3">Notes saved with this invoice.</p>
        </div>

        <div className="p-6">
          {invoice.notes ? (
            <div className="rounded-pl-md bg-pl-surface border border-pl-border-dark p-5 whitespace-pre-wrap leading-relaxed text-pl-ink">{invoice.notes}</div>
          ) : (
            <div className="rounded-pl-md border border-dashed border-pl-border-dark bg-pl-surface p-10 text-center">
              <p className="text-pl-ink-3">No notes were added to this invoice.</p>
            </div>
          )}
        </div>
      </Card>

      {/* ===================================================== */}
      {/* Delete Modal */}
      {/* ===================================================== */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-pl-lg border border-pl-border-dark bg-white shadow-xl">
            <div className="border-b border-pl-border-dark p-6">
              <h2 className="text-lg font-bold text-pl-red">Delete Invoice</h2>

              <p className="mt-2 text-sm text-pl-ink-3">This action cannot be undone.</p>
            </div>

            <div className="p-6">
              <div className="rounded-pl-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  You are about to permanently delete
                  <span className="font-bold"> {invoice.invoiceNumber}</span>.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-pl-border-dark p-6">
              <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>

              <Button
                variant="danger"
                isLoading={cancelInvoice.isPending}
                onClick={() =>
                  cancelInvoice.mutate(invoiceId, {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["invoices"],
                      });

                      queryClient.invalidateQueries({
                        queryKey: ["invoice", invoiceId],
                      });
                      router.push("/invoices");
                    },
                  })
                }>
                Proceed
              </Button>
            </div>
          </div>
        </div>
      )}

      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-pl-lg border border-pl-border-dark bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-pl-border-dark p-6">
              <h2 className="text-lg font-bold text-pl-ink">Generate Payment Checkout</h2>

              <p className="mt-2 text-sm text-pl-ink-3">Select the payment methods customers can use to pay this invoice.</p>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method}
                    className="flex items-center justify-between rounded-pl-md border border-pl-border-dark p-3 cursor-pointer hover:border-pl-primary hover:bg-pl-surface transition">
                    <div>
                      <p className="font-medium text-pl-ink">{method}</p>
                    </div>

                    <input type="checkbox" checked={selectedMethods.includes(method)} onChange={() => toggleMethod(method)} className="h-4 w-4 accent-pl-primary" />
                  </label>
                ))}
              </div>

              {selectedMethods.length === 0 && <p className="mt-4 text-xs text-pl-red">Select at least one payment method.</p>}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-pl-border-dark p-6">
              <Button variant="ghost" onClick={() => setPaymentModalOpen(false)}>
                Cancel
              </Button>

              <Button
                variant="primary"
                disabled={selectedMethods.length === 0}
                isLoading={generateCheckout.isPending}
                onClick={() =>
                  generateCheckout.mutate(
                    {
                      id: invoiceId,
                      allowedPaymentMethods: selectedMethods,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["invoice", invoiceId],
                        });

                        queryClient.invalidateQueries({
                          queryKey: ["invoices"],
                        });

                        setPaymentModalOpen(false);
                      },
                    },
                  )
                }>
                Generate Checkout
              </Button>
            </div>
          </div>
        </div>
      )}

      <CreateInvoiceModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} invoiceDetails={invoice} />
    </div>
  );
}
